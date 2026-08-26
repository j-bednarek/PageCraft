const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
const PORT = process.env.PORT || 3000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
const FIFTEEN_MIN = 15 * 60 * 1000;
const tooManyLogins = { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' };

const loginIpLimiter = rateLimit({
    windowMs: FIFTEEN_MIN,
    limit: 20,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: tooManyLogins,
});

const loginEmailLimiter = rateLimit({
    windowMs: FIFTEEN_MIN,
    limit: 8,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: tooManyLogins,
    keyGenerator: (req) => {
        const email = req.body?.email;
        if (typeof email === 'string' && email.trim()) {
            return 'email:' + normalizeEmail(email);
        }
        return 'ip:' + ipKeyGenerator(req.ip);
    },
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Zbyt wiele rejestracji z tego adresu. Spróbuj za godzinę.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX_BYTES = 72;

const BCRYPT_ROUNDS = 12;

const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_ROUNDS);

function startSession(req, userId, rememberMe) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) return reject(err);

            req.session.userId = userId;

            if (!rememberMe) {
                req.session.cookie.expires = false;
            }

            req.session.save((err) => (err ? reject(err) : resolve()));
        });
    });
}

function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email };
}

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Brak dostępu. Zaloguj się.' });
    }
    next();
}

const DRAFT_LIMIT = 5;

const FREE_PLAN_FALLBACK = { id: null, name: 'free', price_cents: 0, max_active_pages: 0 };

function accountUser(user) {
    return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        created_at: user.created_at
    };
}

function publicPlan(plan) {
    return {
        id: plan.id,
        name: plan.name,
        price_cents: plan.price_cents,
        max_active_pages: plan.max_active_pages
    };
}

async function getCurrentPlan(userId) {
    const subscription = await prisma.subscriptions.findFirst({
        where: {
            user_id: userId,
            OR: [
                { status: 'active' },
                { status: 'canceled', current_period_end: { gt: new Date() } }
            ]
        },
        orderBy: { created_at: 'desc' },
        include: { plans: true }
    });

    if (subscription) {
        return {
            plan: subscription.plans,
            subscription: {
                status: subscription.status,
                current_period_end: subscription.current_period_end
            }
        };
    }

    const freePlan = await prisma.plans.findUnique({ where: { name: 'free' } });
    return { plan: freePlan || FREE_PLAN_FALLBACK, subscription: null };
}

function validateNewPassword(password) {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
        return `Hasło musi mieć co najmniej ${PASSWORD_MIN} znaków.`;
    }
    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return 'Hasło jest za długie.';
    }
    return null;
}

async function verifyCurrentPassword(userId, password) {
    if (typeof password !== 'string' || !password ||
        Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return null;
    }
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password_hash);
    return ok ? user : null;
}

async function destroyUserSessions(userId, keepSid = '') {
    await pool.query(
        `DELETE FROM "session" WHERE (sess->>'userId')::int = $1 AND sid <> $2`,
        [userId, keepSid]
    );
}

const accountLimiter = rateLimit({
    windowMs: FIFTEEN_MIN,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.' },
    keyGenerator: (req) => 'user:' + req.session.userId,
});

app.post('/api/auth/register', registerLimiter, async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        if (typeof name !== 'string' || typeof surname !== 'string' ||
            typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Wypełnij wszystkie pola!' });
        }

        const cleanName = name.trim();
        const cleanSurname = surname.trim();
        const cleanEmail = normalizeEmail(email);

        if (!cleanName || !cleanSurname || !cleanEmail || !password) {
            return res.status(400).json({ error: 'Wypełnij wszystkie pola!' });
        }
        if (cleanName.length > 100 || cleanSurname.length > 100 || cleanEmail.length > 255) {
            return res.status(400).json({ error: 'Któreś z pól jest za długie.' });
        }
        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({ error: 'Podaj poprawny adres email.' });
        }
        if (password.length < PASSWORD_MIN) {
            return res.status(400).json({ error: `Hasło musi mieć co najmniej ${PASSWORD_MIN} znaków.` });
        }
        if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
            return res.status(400).json({ error: 'Hasło jest za długie.' });
        }

        const existingUser = await prisma.users.findUnique({
            where: { email: cleanEmail }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Użytkownik o tym adresie email już istnieje.' });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const newUser = await prisma.users.create({
            data: {
                name: cleanName,
                surname: cleanSurname,
                email: cleanEmail,
                password_hash: hashedPassword
            }
        });

        await startSession(req, newUser.id, true);

        res.status(201).json({
            message: 'Konto zostało pomyślnie utworzone!',
            user: publicUser(newUser)
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Użytkownik o tym adresie email już istnieje.' });
        }
        console.error('Błąd podczas rejestracji:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas rejestracji.' });
    }
});

app.post('/api/auth/login', loginIpLimiter, loginEmailLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ error: 'Podaj email i hasło.' });
        }
        if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        const user = await prisma.users.findUnique({
            where: { email: normalizeEmail(email) }
        });

        const isPasswordValid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

        if (!user || !isPasswordValid) {
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        await startSession(req, user.id, rememberMe === true);

        res.json({
            message: 'Zalogowano pomyślnie!',
            user: publicUser(user)
        });

    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera podczas logowania.' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Nie zalogowano.' });
        }

        const user = await prisma.users.findUnique({
            where: { id: req.session.userId },
            select: { id: true, name: true, email: true }
        });

        if (!user) {
            return req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.status(401).json({ error: 'Nie zalogowano.' });
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Błąd weryfikacji sesji /auth/me:', error);
        res.status(500).json({ error: 'Błąd serwera podczas weryfikacji sesji.' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Błąd podczas wylogowywania' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Wylogowano. Ciasteczko i sesja usunięte.' });
    });
});

app.get('/api/account', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;

        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ error: 'Nie zalogowano.' });
        }

        const { plan, subscription } = await getCurrentPlan(userId);

        const [published, total] = await Promise.all([
            prisma.pages.count({ where: { user_id: userId, status: true } }),
            prisma.pages.count({ where: { user_id: userId } })
        ]);

        res.json({
            user: accountUser(user),
            plan: publicPlan(plan),
            subscription,
            usage: {
                published,
                publishedLimit: plan.max_active_pages,
                drafts: total - published,
                draftLimit: DRAFT_LIMIT
            }
        });
    } catch (error) {
        console.error('Błąd pobierania konta:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.get('/api/plans', async (req, res) => {
    try {
        const plans = await prisma.plans.findMany({ orderBy: { price_cents: 'asc' } });
        res.json(plans.map(publicPlan));
    } catch (error) {
        console.error('Błąd pobierania planów:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.patch('/api/account/profile', requireAuth, async (req, res) => {
    try {
        const { name, surname } = req.body;
        if (typeof name !== 'string' || typeof surname !== 'string') {
            return res.status(400).json({ error: 'Wypełnij wszystkie pola!' });
        }
        const cleanName = name.trim();
        const cleanSurname = surname.trim();
        if (!cleanName || !cleanSurname) {
            return res.status(400).json({ error: 'Wypełnij wszystkie pola!' });
        }
        if (cleanName.length > 100 || cleanSurname.length > 100) {
            return res.status(400).json({ error: 'Któreś z pól jest za długie.' });
        }

        const user = await prisma.users.update({
            where: { id: req.session.userId },
            data: { name: cleanName, surname: cleanSurname }
        });

        res.json({ message: 'Zapisano zmiany.', user: accountUser(user) });
    } catch (error) {
        console.error('Błąd zmiany profilu:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.patch('/api/account/email', requireAuth, accountLimiter, async (req, res) => {
    try {
        const { newEmail, currentPassword } = req.body;

        const user = await verifyCurrentPassword(req.session.userId, currentPassword);
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowe hasło.' });
        }

        if (typeof newEmail !== 'string') {
            return res.status(400).json({ error: 'Podaj poprawny adres email.' });
        }
        const cleanEmail = normalizeEmail(newEmail);
        if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 255) {
            return res.status(400).json({ error: 'Podaj poprawny adres email.' });
        }
        if (cleanEmail === user.email) {
            return res.status(400).json({ error: 'To jest Twój obecny adres email.' });
        }

        const updated = await prisma.users.update({
            where: { id: user.id },
            data: { email: cleanEmail }
        });

        res.json({ message: 'Adres email został zmieniony.', user: accountUser(updated) });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Ten adres email jest już zajęty.' });
        }
        console.error('Błąd zmiany emaila:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.patch('/api/account/password', requireAuth, accountLimiter, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await verifyCurrentPassword(req.session.userId, currentPassword);
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowe obecne hasło.' });
        }

        const validationError = validateNewPassword(newPassword);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        if (await bcrypt.compare(newPassword, user.password_hash)) {
            return res.status(400).json({ error: 'Nowe hasło musi różnić się od obecnego.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
        await prisma.users.update({
            where: { id: user.id },
            data: { password_hash: hashedPassword }
        });

        const rememberMe = typeof req.session.cookie.maxAge === 'number';
        await destroyUserSessions(user.id, req.sessionID);
        await startSession(req, user.id, rememberMe);

        res.json({ message: 'Hasło zostało zmienione. Inne urządzenia zostały wylogowane.' });
    } catch (error) {
        console.error('Błąd zmiany hasła:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.delete('/api/account', requireAuth, accountLimiter, async (req, res) => {
    try {
        const { password } = req.body;

        const user = await verifyCurrentPassword(req.session.userId, password);
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowe hasło.' });
        }

        await prisma.$transaction([
            prisma.pages.deleteMany({ where: { user_id: user.id } }),
            prisma.subscriptions.deleteMany({ where: { user_id: user.id } }),
            prisma.users.delete({ where: { id: user.id } })
        ]);

        await destroyUserSessions(user.id);
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: 'Konto zostało usunięte.' });
        });
    } catch (error) {
        console.error('Błąd usuwania konta:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serwer wystartował pod adresem http://localhost:${PORT}`);
});

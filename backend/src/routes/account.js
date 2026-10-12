const express = require('express');
const bcrypt = require('bcrypt');
const { prisma } = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { accountLimiter } = require('../middleware/limiters');
const { DRAFT_LIMIT, publicPlan, getCurrentPlan } = require('../utils/plans');
const {
    EMAIL_REGEX,
    BCRYPT_ROUNDS,
    normalizeEmail,
    startSession,
    destroyUserSessions,
    accountUser,
    validateNewPassword,
    verifyCurrentPassword
} = require('../utils/users');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
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

router.patch('/profile', async (req, res) => {
    try {
        const { name, surname } = req.body ?? {};
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

router.patch('/email', accountLimiter, async (req, res) => {
    try {
        const { newEmail, currentPassword } = req.body ?? {};

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

router.patch('/password', accountLimiter, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body ?? {};

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

router.delete('/', accountLimiter, async (req, res) => {
    try {
        const { password } = req.body ?? {};

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

module.exports = router;

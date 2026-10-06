const express = require('express');
const bcrypt = require('bcrypt');
const { prisma } = require('../db');
const { loginIpLimiter, loginEmailLimiter, registerLimiter } = require('../middleware/limiters');
const {
    EMAIL_REGEX,
    PASSWORD_MIN,
    PASSWORD_MAX_BYTES,
    BCRYPT_ROUNDS,
    DUMMY_HASH,
    normalizeEmail,
    startSession,
    publicUser
} = require('../utils/users');

const router = express.Router();

router.post('/register', registerLimiter, async (req, res) => {
    try {
        const { name, surname, email, password } = req.body ?? {};

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

router.post('/login', loginIpLimiter, loginEmailLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body ?? {};

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

router.get('/me', async (req, res) => {
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

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Błąd podczas wylogowywania' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Wylogowano. Ciasteczko i sesja usunięte.' });
    });
});

module.exports = router;

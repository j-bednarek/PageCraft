const bcrypt = require('bcrypt');
const { prisma, pool } = require('../db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX_BYTES = 72;
const BCRYPT_ROUNDS = 12;
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_ROUNDS);

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

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

async function destroyUserSessions(userId, keepSid = '') {
    await pool.query(
        `DELETE FROM "session" WHERE (sess->>'userId')::int = $1 AND sid <> $2`,
        [userId, keepSid]
    );
}

function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email };
}

function accountUser(user) {
    return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        created_at: user.created_at
    };
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

module.exports = {
    EMAIL_REGEX,
    PASSWORD_MIN,
    PASSWORD_MAX_BYTES,
    BCRYPT_ROUNDS,
    DUMMY_HASH,
    normalizeEmail,
    startSession,
    destroyUserSessions,
    publicUser,
    accountUser,
    validateNewPassword,
    verifyCurrentPassword
};

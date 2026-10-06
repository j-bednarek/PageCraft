const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { normalizeEmail } = require('../utils/users');

const FIFTEEN_MIN = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

function limiter(options) {
    return rateLimit({
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ...options
    });
}

function byUser(req) {
    return 'user:' + req.session.userId;
}

const tooManyLogins = { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' };

const loginIpLimiter = limiter({
    windowMs: FIFTEEN_MIN,
    limit: 20,
    skipSuccessfulRequests: true,
    message: tooManyLogins
});

const loginEmailLimiter = limiter({
    windowMs: FIFTEEN_MIN,
    limit: 8,
    skipSuccessfulRequests: true,
    message: tooManyLogins,
    keyGenerator: (req) => {
        const email = req.body?.email;
        if (typeof email === 'string' && email.trim()) {
            return 'email:' + normalizeEmail(email);
        }
        return 'ip:' + ipKeyGenerator(req.ip);
    }
});

const registerLimiter = limiter({
    windowMs: ONE_HOUR,
    limit: 5,
    message: { error: 'Zbyt wiele rejestracji z tego adresu. Spróbuj za godzinę.' }
});

const accountLimiter = limiter({
    windowMs: FIFTEEN_MIN,
    limit: 10,
    skipSuccessfulRequests: true,
    message: { error: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.' },
    keyGenerator: byUser
});

const createPageLimiter = limiter({
    windowMs: ONE_HOUR,
    limit: 30,
    message: { error: 'Tworzysz strony zbyt szybko. Spróbuj ponownie za godzinę.' },
    keyGenerator: byUser
});

module.exports = {
    loginIpLimiter,
    loginEmailLimiter,
    registerLimiter,
    accountLimiter,
    createPageLimiter
};

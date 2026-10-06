function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Brak dostępu. Zaloguj się.' });
    }
    next();
}

module.exports = requireAuth;

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('../db');

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

module.exports = session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: THIRTY_DAYS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
});

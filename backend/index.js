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


app.listen(PORT, () => {
    console.log(`🚀 Serwer wystartował pod adresem http://localhost:${PORT}`);
});

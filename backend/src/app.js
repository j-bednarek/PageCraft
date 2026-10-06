const express = require('express');
const cors = require('cors');

const sessionMiddleware = require('./middleware/session');
const { notFound, errorHandler } = require('./middleware/errors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const plansRoutes = require('./routes/plans');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '200kb' }));
app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/plans', plansRoutes);

app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;

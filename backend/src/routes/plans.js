const express = require('express');
const { prisma } = require('../db');
const { publicPlan } = require('../utils/plans');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const plans = await prisma.plans.findMany({ orderBy: { price_cents: 'asc' } });
        res.json(plans.map(publicPlan));
    } catch (error) {
        console.error('Błąd pobierania planów:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

module.exports = router;

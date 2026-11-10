const express = require('express');
const { prisma } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const templates = await prisma.templates.findMany({
            where: { is_active: true },
            orderBy: { id: 'asc' },
            select: {
                id: true,
                name: true,
                category: true,
                component_key: true,
                thumbnail_url: true
            }
        });

        res.json(templates);
    } catch (error) {
        console.error('Błąd pobierania szablonów:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

module.exports = router;
const express = require('express');
const { prisma } = require('../db');

const router = express.Router();

router.get('/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const page = await prisma.pages.findFirst({
            where: { slug: slug, status: true },
            select: {
                slug: true,
                title: true,
                content: true,
                templates: { select: { component_key: true } }
            }
        });

        if (!page) {
            return res.status(404).json({ error: 'Nie znaleziono takiej strony.' });
        }

        res.json(page);
    } catch (error) {
        console.error('Błąd pobierania strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

module.exports = router;

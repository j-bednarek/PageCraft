const express = require('express');
const { prisma } = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { slugCheckLimiter } = require('../middleware/limiters');
const { parseId } = require('../utils/ids');
const { normalizeSlug, slugError } = require('../utils/slugs');

const router = express.Router();
router.use(requireAuth);

router.get('/check', slugCheckLimiter, async (req, res) => {
    try {
        const slug = normalizeSlug(req.query.slug);
        const pageId = parseId(req.query.pageId);

        const error = slugError(slug);
        if (error) {
            return res.json({ available: false, message: error });
        }

        const owner = await prisma.pages.findFirst({
            where: { slug: slug },
            select: { id: true }
        });

        if (owner && owner.id !== pageId) {
            return res.json({ available: false, message: 'Ten adres jest już zajęty.' });
        }

        res.json({ available: true, message: null });
    } catch (error) {
        console.error('Błąd sprawdzania adresu:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

module.exports = router;
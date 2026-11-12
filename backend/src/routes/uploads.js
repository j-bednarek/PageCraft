const express = require('express');
const { prisma } = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { uploadLimiter } = require('../middleware/limiters');
const { parseId } = require('../utils/ids');
const { ALLOWED_TYPES, pagePrefix, createUploadUrl } = require('../storage');

const router = express.Router();
router.use(requireAuth);

const PAGE_NOT_FOUND = { error: 'Nie znaleziono strony.' };

router.post('/presign', uploadLimiter, async (req, res) => {
    try {
        const { pageId: rawPageId, contentType } = req.body ?? {};

        if (!ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ error: 'Dozwolone są tylko obrazy JPG, PNG i WebP.' });
        }

        const pageId = parseId(rawPageId);
        if (!pageId) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const page = await prisma.pages.findFirst({
            where: { id: pageId, user_id: req.session.userId },
            select: { id: true }
        });
        if (!page) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const upload = await createUploadUrl(pagePrefix(req.session.userId, page.id), contentType);
        res.json(upload);
    } catch (error) {
        console.error('Błąd przygotowania uploadu:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

module.exports = router;
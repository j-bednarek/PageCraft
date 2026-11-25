const express = require('express');
const { prisma } = require('../db');
const requireAuth = require('../middleware/requireAuth');


const { parseId } = require('../utils/ids');
const router = express.Router();
const { removePrefix, pagePrefix } = require('../storage');
const TITLE_MAX = 100;
const CONTENT_MAX_BYTES = 100 * 1024;
const { Prisma } = require('@prisma/client');
const { createPageLimiter, publishLimiter } = require('../middleware/limiters');
const { DRAFT_LIMIT, getCurrentPlan } = require('../utils/plans');
const { normalizeSlug, slugError } = require('../utils/slugs');
const { renderPublishedPage } = require('../render');
const PAGE_NOT_FOUND = { error: 'Nie znaleziono strony.' };

const EDITOR_FIELDS = {
    id: true,
    title: true,
    slug: true,
    status: true,
    content: true,
    created_at: true,
    updated_at: true,
    templates: { select: { component_key: true, name: true } }
};

const PUBLISHED_FIELDS = { id: true, slug: true, status: true, published_at: true };

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function titleError(title) {
    if (typeof title !== 'string' || !title.trim()) {
        return 'Podaj tytuł strony.';
    }
    if (title.trim().length > TITLE_MAX) {
        return `Tytuł może mieć najwyżej ${TITLE_MAX} znaków.`;
    }
    return null;
}

function contentError(content) {
    if (!isPlainObject(content)) {
        return 'Nieprawidłowa treść strony.';
    }
    if (Buffer.byteLength(JSON.stringify(content), 'utf8') > CONTENT_MAX_BYTES) {
        return 'Treść strony jest za duża.';
    }
    return null;
}

router.use(requireAuth);

router.get('/my-projects', async (req, res) => {
    try {
        const userPages = await prisma.pages.findMany({
            where: { user_id: req.session.userId },
            orderBy: { updated_at: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                created_at: true,
                updated_at: true,
                pending_deletion_at: true,
                templates: { select: { name: true, thumbnail_url: true } }
            }
        });

        res.json(userPages);
    } catch (error) {
        console.error('Błąd pobierania projektów:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

router.post('/', createPageLimiter, async (req, res) => {
    try {
        const { templateKey, title, content = {} } = req.body ?? {};

        if (typeof templateKey !== 'string' || !templateKey) {
            return res.status(400).json({ error: 'Wybierz szablon.' });
        }

        const template = await prisma.templates.findUnique({
            where: { component_key: templateKey }
        });
        if (!template || !template.is_active) {
            return res.status(400).json({ error: 'Ten szablon nie jest dostępny.' });
        }

        const pageTitle = title === undefined ? template.name : title;
        const validationError = titleError(pageTitle) || contentError(content);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const drafts = await prisma.pages.count({
            where: { user_id: req.session.userId, status: false }
        });
        if (drafts >= DRAFT_LIMIT) {
            return res.status(403).json({
                error: `Możesz mieć najwyżej ${DRAFT_LIMIT} szkiców. Usuń któryś, aby utworzyć nowy.`
            });
        }

        const page = await prisma.pages.create({
            data: {
                user_id: req.session.userId,
                template_id: template.id,
                title: pageTitle.trim(),
                content: content
            },
            select: EDITOR_FIELDS
        });

        res.status(201).json({ page });
    } catch (error) {
        console.error('Błąd tworzenia strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const page = await prisma.pages.findFirst({
            where: { id: id, user_id: req.session.userId },
            select: EDITOR_FIELDS
        });
        if (!page) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        res.json({ page });
    } catch (error) {
        console.error('Błąd pobierania strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const { title, content } = req.body ?? {};
        if (title === undefined && content === undefined) {
            return res.status(400).json({ error: 'Brak zmian do zapisania.' });
        }

        const data = {};
        if (title !== undefined) {
            const error = titleError(title);
            if (error) return res.status(400).json({ error });
            data.title = title.trim();
        }
        if (content !== undefined) {
            const error = contentError(content);
            if (error) return res.status(400).json({ error });
            data.content = content;
        }

        const page = await prisma.pages.update({
            where: { id: id, user_id: req.session.userId },
            data: data,
            select: { id: true, title: true, updated_at: true }
        });

        res.json({ page });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(PAGE_NOT_FOUND);
        }
        console.error('Błąd zapisywania strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        await prisma.pages.delete({
            where: { id: id, user_id: req.session.userId }
        });
        removePrefix(pagePrefix(req.session.userId, id))
    .catch((err) => console.error('Błąd usuwania plików strony:', err));
        res.json({ message: 'Strona została usunięta.' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(PAGE_NOT_FOUND);
        }
        console.error('Błąd usuwania strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});
router.post('/:id/publish', publishLimiter, async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const slug = normalizeSlug(req.body?.slug);
        const error = slugError(slug);
        if (error) {
            return res.status(400).json({ error });
        }

        const userId = req.session.userId;
        const result = await prisma.$transaction(async (tx) => {
            const page = await tx.pages.findFirst({
                where: { id: id, user_id: userId },
                select: { status: true, title: true, content: true, templates: { select: { component_key: true } } }
            });
            if (!page) {
                return { status: 404, body: PAGE_NOT_FOUND };
            }

            if (!page.status) {
                const { plan } = await getCurrentPlan(userId);
                const publishedCount = await tx.pages.count({ where: { user_id: userId, status: true } });
                if (plan.max_active_pages !== null && publishedCount >= plan.max_active_pages) {
                    return {
                        status: 403,
                        body: { error: 'Twój plan nie pozwala opublikować kolejnej strony.', code: 'PLAN_LIMIT' }
                    };
                }
            }

            const html = renderPublishedPage({
                templateKey: page.templates.component_key,
                content: page.content,
                title: page.title
            });

            const updated = await tx.pages.update({
                where: { id: id },
                data: {
                    slug: slug,
                    status: true,
                    published_content: page.content,
                    published_html: html,
                    published_at: new Date()
                },
                select: PUBLISHED_FIELDS
            });
            return { status: 200, body: { page: updated } };
        }, { isolationLevel: 'Serializable' });

        res.status(result.status).json(result.body);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Ten adres jest już zajęty.' });
        }
        if (error.code === 'P2034') {
            return res.status(409).json({ error: 'Strona jest właśnie zmieniana. Spróbuj ponownie.' });
        }
        console.error('Błąd publikacji strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});
router.post('/:id/unpublish', async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(404).json(PAGE_NOT_FOUND);
        }

        const page = await prisma.pages.update({
            where: { id: id, user_id: req.session.userId },
            data: { status: false, published_content: Prisma.DbNull, published_html: null, published_at: null },
            select: PUBLISHED_FIELDS
        });

        res.json({ page });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json(PAGE_NOT_FOUND);
        }
        console.error('Błąd wyłączania strony:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
});
module.exports = router;

const express = require('express');
const { prisma } = require('../db');
const { SLUG_REGEX } = require('../utils/slugs');

const router = express.Router();

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nie ma takiej strony</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f4f5f2;color:#0d120f;text-align:center}a{color:#0d120f}</style>
</head>
<body><main><h1>Nie ma takiej strony</h1><p>Adres jest błędny albo strona została wyłączona.</p><p><a href="/">Wróć na PageCraft</a></p></main></body>
</html>`;

const CONTENT_SECURITY_POLICY = [
    "default-src 'none'",
    "img-src https: data:",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "base-uri 'none'",
    "form-action 'none'"
].join('; ');

function sendNotFound(res) {
    res.status(404).type('html').send(NOT_FOUND_HTML);
}

router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        if (!SLUG_REGEX.test(slug)) {
            return sendNotFound(res);
        }

        const page = await prisma.pages.findFirst({
            where: { slug: slug, status: true },
            select: { published_html: true }
        });
        if (!page?.published_html) {
            return sendNotFound(res);
        }

        res.set({
            'Cache-Control': 'public, max-age=60',
            'Content-Security-Policy': CONTENT_SECURITY_POLICY,
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        });
        res.type('html').send(page.published_html);
    } catch (error) {
        console.error('Błąd wyświetlania strony:', error);
        res.status(500).type('html').send('<h1>Wystąpił błąd serwera</h1>');
    }
});

router.use((req, res) => sendNotFound(res));

module.exports = router;
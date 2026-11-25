import { renderToStaticMarkup } from 'react-dom/server';
import { getTemplate } from '../pages/templates/registry';
import { withDefaults } from '../pages/editor/contentState';
import { FONTS } from '../assets/shared/fonts';

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function collectFonts(value, found) {
    if (Array.isArray(value)) {
        value.forEach((item) => collectFonts(item, found));
    } else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) {
            if ((key === 'font' || key === 'headingFont') && typeof item === 'string') {
                found.add(item);
            } else {
                collectFonts(item, found);
            }
        }
    }
    return found;
}

function fontsLink(content) {
    const used = collectFonts(content, new Set());
    const families = FONTS.filter((font) => used.has(font.name)).map((font) => `family=${font.query}`);
    if (families.length === 0) {
        return '';
    }
    const href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
    return `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${escapeHtml(href)}">`;
}

export function renderPage({ templateKey, content, title }) {
    const template = getTemplate(templateKey);
    if (!template) {
        throw new Error(`Unknown template: ${templateKey}`);
    }

    const data = withDefaults(template.defaultContent, content);
    const Template = template.component;
    const body = renderToStaticMarkup(<Template content={data} />);

    const seo = data.seo ?? {};
    const pageTitle = seo.title || title || template.name;
    const meta = [
        `<title>${escapeHtml(pageTitle)}</title>`,
        `<meta property="og:title" content="${escapeHtml(pageTitle)}">`,
        '<meta property="og:type" content="website">',
    ];
    if (seo.description) {
        meta.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);
        meta.push(`<meta property="og:description" content="${escapeHtml(seo.description)}">`);
    }
    if (seo.image) {
        meta.push(`<meta property="og:image" content="${escapeHtml(seo.image)}">`);
    }

    return [
        '<!DOCTYPE html>',
        '<html lang="pl">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        ...meta,
        fontsLink(data),
        `<style>body{margin:0}${template.css}</style>`,
        '</head>',
        `<body>${body}</body>`,
        '</html>',
    ].join('\n');
}
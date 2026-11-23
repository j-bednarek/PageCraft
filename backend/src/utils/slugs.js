const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

const RESERVED_SLUGS = new Set([
    'api', 'account', 'editor', 'templates', 'admin', 'login', 'register',
    'logout', 'assets', 'thumbnails', 'static', 'public', 'app', 'www',
    'pricing', 'about', 'contact', 'help', 'support', 'blog', 'docs',
    'terms', 'privacy', 'settings', 'dashboard', 'pagecraft'
]);

function normalizeSlug(value) {
    return typeof value === 'string' ? value.toLowerCase().trim() : '';
}

function slugError(slug) {
    if (!SLUG_REGEX.test(slug)) {
        return 'Adres może mieć 3–40 znaków: małe litery, cyfry i myślniki (nie na początku ani na końcu).';
    }
    if (RESERVED_SLUGS.has(slug)) {
        return 'Ten adres jest zarezerwowany. Wybierz inny.';
    }
    return null;
}

module.exports = { SLUG_REGEX, normalizeSlug, slugError };
export const FONTS = [
    { name: 'Onest', stack: "'Onest', system-ui, sans-serif", query: 'Onest:wght@400;500;600;700' },
    { name: 'Instrument Serif', stack: "'Instrument Serif', Georgia, serif", query: 'Instrument+Serif:ital@0;1' },
    { name: 'Inter', stack: "'Inter', system-ui, sans-serif", query: 'Inter:wght@400;500;600;700' },
    { name: 'Outfit', stack: "'Outfit', system-ui, sans-serif", query: 'Outfit:wght@400;500;600;700' },
    { name: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif", query: 'Space+Grotesk:wght@400;500;700' },
    { name: 'Playfair Display', stack: "'Playfair Display', Georgia, serif", query: 'Playfair+Display:wght@400;600;700' },
    { name: 'DM Mono', stack: "'DM Mono', ui-monospace, monospace", query: 'DM+Mono:wght@400;500' },
];

export const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2?' +
    FONTS.map((font) => `family=${font.query}`).join('&') +
    '&display=swap';

export function fontStack(name) {
    const font = FONTS.find((f) => f.name === name);
    return font ? font.stack : undefined;
}

import PortfolioMinimal from './PortfolioMinimal';
import cssText from './portfolioMinimal.module.css?inline';

export default {
    key: 'portfolio_minimal',
    name: 'Portfolio Minimal',
    category: 'portfolio',
    version: 2,
    component: PortfolioMinimal,
    css: cssText,

    defaultContent: {
        theme: {
            primaryColor: '#b15f2c',
            backgroundColor: '#f3f2ee',
            textColor: '#16212f',
            font: 'Onest',
            headingFont: 'Instrument Serif',
        },
        hero: {
            eyebrow: 'Frontend Developer · Łódź',
            title: { text: 'Jan Kowalski', font: null, color: null },
            intro: 'Projektuję i buduję szybkie, dostępne strony oraz aplikacje internetowe. Lubię prosty kod, czytelne interfejsy i dopracowane detale.',
            image: '',
            buttonText: 'Zobacz projekty',
            buttonUrl: 'https://github.com',
        },
        about: {
            heading: { text: 'O mnie', font: null, color: null },
            text: 'Od trzech lat tworzę interfejsy w React i TypeScript. Pracowałem przy sklepach internetowych, panelach administracyjnych i stronach dla małych firm. Najbardziej lubię momenty, w których projekt z makiety zaczyna naprawdę działać.',
        },
        contact: {
            heading: 'Porozmawiajmy',
            text: 'Masz pomysł na projekt albo szukasz kogoś do zespołu? Napisz — odpowiadam zwykle w ciągu jednego dnia.',
            email: 'jan.kowalski@example.com',
        },
        socials: [
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'LinkedIn', url: 'https://linkedin.com' },
            { name: 'Instagram', url: 'https://instagram.com' },
        ],
    },

    fields: [
        { section: 'Theme', path: 'theme.primaryColor',    type: 'color', label: 'Accent color' },
        { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
        { section: 'Theme', path: 'theme.textColor',       type: 'color', label: 'Text color' },
        { section: 'Theme', path: 'theme.headingFont',     type: 'font',  label: 'Heading font' },
        { section: 'Theme', path: 'theme.font',            type: 'font',  label: 'Body font' },

        { section: 'Hero', path: 'hero.eyebrow',    type: 'text',       label: 'Tagline' },
        { section: 'Hero', path: 'hero.title',      type: 'styledText', label: 'Name' },
        { section: 'Hero', path: 'hero.intro',      type: 'textarea',   label: 'Intro' },
        { section: 'Hero', path: 'hero.image',      type: 'image',      label: 'Photo' },
        { section: 'Hero', path: 'hero.buttonText', type: 'text',       label: 'Button text' },
        { section: 'Hero', path: 'hero.buttonUrl',  type: 'url',        label: 'Button link' },

        { section: 'About', path: 'about.heading', type: 'styledText', label: 'Heading' },
        { section: 'About', path: 'about.text',    type: 'textarea',   label: 'Text' },

        { section: 'Contact', path: 'contact.heading', type: 'text',     label: 'Heading' },
        { section: 'Contact', path: 'contact.text',    type: 'textarea', label: 'Text' },
        { section: 'Contact', path: 'contact.email',   type: 'email',    label: 'Email' },

        { section: 'Social media', path: 'socials', type: 'links', label: 'Links' },
    ],
};

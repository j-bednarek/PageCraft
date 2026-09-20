import PortfolioMinimal from './PortfolioMinimal';
import cssText from './portfolioMinimal.module.css?inline';
export default {
    key: 'portfolio_minimal',
    name: 'Portfolio Minimal',
    category: 'portfolio',
    version: 1,
    component: PortfolioMinimal,
    css: cssText,
    defaultContent: {
        theme: {
            primaryColor: '#4dffa0',
            backgroundColor: '#0a0a0a',
            textColor: '#f0f0f0',
            font: 'Inter',
        },
        hero: {
            title: { text: 'Jan Kowalski', font: null, color: null },
            subtitle: 'Frontend Developer',
            image: '',
            buttonText: 'Zobacz moje projekty',
            buttonUrl: 'https://github.com',
        },
        about: {
            heading: { text: 'O mnie', font: null, color: null },
            text: 'Jestem frontend developerem, który tworzy nowoczesne i responsywne aplikacje internetowe.',
        },
        socials: [
            { name: 'Facebook', url: 'https://facebook.com' },
            { name: 'Instagram', url: 'https://instagram.com' },
            { name: 'GitHub', url: 'https://github.com' },
        ],
    },

    fields: [
    { section: 'Theme', path: 'theme.primaryColor',    type: 'color', label: 'Main color' },
    { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
    { section: 'Theme', path: 'theme.textColor',       type: 'color', label: 'Text color' },
    { section: 'Theme', path: 'theme.font',            type: 'font',  label: 'Font' },

    { section: 'Hero', path: 'hero.title',      type: 'styledText', label: 'Name' },
    { section: 'Hero', path: 'hero.subtitle',   type: 'text',       label: 'Subtitle' },
    { section: 'Hero', path: 'hero.image',      type: 'image',      label: 'Photo' },
    { section: 'Hero', path: 'hero.buttonText', type: 'text',       label: 'Button text' },
    { section: 'Hero', path: 'hero.buttonUrl',  type: 'url',        label: 'Button link' },

    { section: 'About', path: 'about.heading', type: 'styledText', label: 'Heading' },
    { section: 'About', path: 'about.text',    type: 'textarea',   label: 'Text' },

    { section: 'Social media', path: 'socials', type: 'links', label: 'Links' },
],
};

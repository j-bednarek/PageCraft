import ResumeClassic from './ResumeClassic';
import cssText from './resumeClassic.module.css?inline';

export default {
    key: 'resume_classic',
    name: 'Resume',
    category: 'resume',
    version: 1,
    component: ResumeClassic,
    css: cssText,

    defaultContent: {
        theme: {
            primaryColor: '#1f4e79',
            backgroundColor: '#ffffff',
            textColor: '#1d2733',
            font: 'Inter',
            headingFont: 'Space Grotesk',
        },
        profile: {
            name: 'Katarzyna Nowak',
            role: 'Specjalistka ds. marketingu internetowego',
            summary: 'Od pięciu lat planuję i prowadzę kampanie online dla firm usługowych i sklepów internetowych. Łączę analizę danych z pisaniem treści, a najlepiej czuję się tam, gdzie wyniki da się zmierzyć.',
            photo: '',
        },
        contact: {
            email: 'k.nowak@example.com',
            phone: '+48 500 000 000',
            location: 'Łódź',
            website: '',
        },
        experience: {
            heading: 'Doświadczenie',
            items: [
                { role: 'Specjalistka ds. marketingu', company: 'Agencja reklamowa, Łódź', period: '2023 – obecnie', description: 'Kampanie Google Ads i Meta Ads dla kilkunastu klientów, raporty miesięczne, współpraca z grafikami i copywriterami.' },
                { role: 'Młodsza specjalistka ds. e-commerce', company: 'Sklep internetowy z wyposażeniem wnętrz', period: '2021 – 2023', description: 'Opisy produktów, newslettery i kampanie sezonowe. Wdrożenie Google Analytics 4.' },
                { role: 'Stażystka w dziale marketingu', company: 'Firma szkoleniowa', period: '2020 – 2021', description: 'Prowadzenie profili w mediach społecznościowych i przygotowanie materiałów na wydarzenia.' },
            ],
        },
        education: {
            heading: 'Wykształcenie',
            items: [
                { school: 'Uniwersytet Łódzki', degree: 'Marketing i komunikacja rynkowa, studia magisterskie', period: '2019 – 2021' },
                { school: 'Uniwersytet Łódzki', degree: 'Zarządzanie, studia licencjackie', period: '2016 – 2019' },
            ],
        },
        skills: {
            heading: 'Umiejętności',
            items: [
                { name: 'Google Ads, Meta Ads' },
                { name: 'Google Analytics 4, Looker Studio' },
                { name: 'Copywriting i content marketing' },
                { name: 'Canva, Figma (podstawy)' },
                { name: 'Język angielski: C1' },
            ],
        },
        links: [
            { name: 'LinkedIn', url: 'https://linkedin.com' },
        ],
    },

    fields: [
        { section: 'Theme', path: 'theme.primaryColor', type: 'color', label: 'Accent color' },
        { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
        { section: 'Theme', path: 'theme.textColor', type: 'color', label: 'Text color' },
        { section: 'Theme', path: 'theme.headingFont', type: 'font', label: 'Heading font' },
        { section: 'Theme', path: 'theme.font', type: 'font', label: 'Body font' },

        { section: 'Profile', path: 'profile.name', type: 'text', label: 'Full name' },
        { section: 'Profile', path: 'profile.role', type: 'text', label: 'Job title' },
        { section: 'Profile', path: 'profile.summary', type: 'textarea', label: 'About me' },
        { section: 'Profile', path: 'profile.photo', type: 'image', label: 'Photo' },

        { section: 'Contact', path: 'contact.email', type: 'email', label: 'Email' },
        { section: 'Contact', path: 'contact.phone', type: 'text', label: 'Phone' },
        { section: 'Contact', path: 'contact.location', type: 'text', label: 'City' },
        { section: 'Contact', path: 'contact.website', type: 'url', label: 'Website' },

        { section: 'Experience', path: 'experience.heading', type: 'text', label: 'Heading' },
        {
            section: 'Experience',
            path: 'experience.items',
            type: 'list',
            label: 'Jobs',
            itemLabel: 'Job',
            itemFields: [
                { key: 'role', label: 'Position', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'period', label: 'Period', type: 'text' },
                { key: 'description', label: 'What you did', type: 'textarea' },
            ],
        },

        { section: 'Education', path: 'education.heading', type: 'text', label: 'Heading' },
        {
            section: 'Education',
            path: 'education.items',
            type: 'list',
            label: 'Schools',
            itemLabel: 'School',
            itemFields: [
                { key: 'school', label: 'School', type: 'text' },
                { key: 'degree', label: 'Field and degree', type: 'text' },
                { key: 'period', label: 'Period', type: 'text' },
            ],
        },

        { section: 'Skills', path: 'skills.heading', type: 'text', label: 'Heading' },
        {
            section: 'Skills',
            path: 'skills.items',
            type: 'list',
            label: 'Skills',
            itemLabel: 'Skill',
            itemFields: [
                { key: 'name', label: 'Skill', type: 'text' },
            ],
        },

        { section: 'Links', path: 'links', type: 'links', label: 'Links' },
    ],
};

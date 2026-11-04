import LocalBusiness from './LocalBusiness';
import cssText from './localBusiness.module.css?inline';

export default {
    key: 'local_business',
    name: 'Local Business',
    category: 'business',
    version: 1,
    component: LocalBusiness,
    css: cssText,

    defaultContent: {
        theme: {
            primaryColor: '#1f6f5c',
            backgroundColor: '#ffffff',
            textColor: '#18222d',
            font: 'Inter',
            headingFont: 'Outfit',
        },
        hero: {
            name: 'Studio Fryzur Lena',
            tagline: 'Fryzjer damski i męski · Łódź, Bałuty',
            intro: 'Strzyżenie, koloryzacja i pielęgnacja włosów w spokojnej atmosferze. Umów wizytę telefonicznie albo wpadnij bez zapisów w sobotę.',
            image: '',
            buttonText: 'Zadzwoń i umów wizytę',
        },
        services: {
            heading: 'Usługi i cennik',
            items: [
                { name: 'Strzyżenie damskie', description: 'Mycie, strzyżenie i modelowanie', price: 'od 90 zł' },
                { name: 'Strzyżenie męskie', description: 'Maszynka i nożyczki, mycie w cenie', price: '60 zł' },
                { name: 'Koloryzacja', description: 'Farbowanie jednolite z konsultacją koloru', price: 'od 180 zł' },
                { name: 'Pielęgnacja keratynowa', description: 'Regeneracja i wygładzenie włosów', price: 'od 220 zł' },
            ],
        },
        about: {
            heading: 'O nas',
            text: 'Salon prowadzimy od 2015 roku. Pracujemy na sprawdzonych kosmetykach i zawsze zaczynamy od rozmowy o tym, czego potrzebujesz. Bez pośpiechu i bez wciskania dodatkowych usług.',
        },
        hours: {
            heading: 'Godziny otwarcia',
            items: [
                { day: 'Poniedziałek – piątek', hours: '9:00 – 19:00' },
                { day: 'Sobota', hours: '9:00 – 15:00' },
                { day: 'Niedziela', hours: 'nieczynne' },
            ],
        },
        contact: {
            heading: 'Kontakt',
            address: 'ul. Zgierska 12, 91-002 Łódź',
            phone: '+48 600 123 456',
            email: 'kontakt@example.com',
            mapUrl: 'https://maps.google.com',
        },
        socials: [
            { name: 'Facebook', url: 'https://facebook.com' },
            { name: 'Instagram', url: 'https://instagram.com' },
        ],
    },

    fields: [
        { section: 'Theme', path: 'theme.primaryColor', type: 'color', label: 'Accent color' },
        { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
        { section: 'Theme', path: 'theme.textColor', type: 'color', label: 'Text color' },
        { section: 'Theme', path: 'theme.headingFont', type: 'font', label: 'Heading font' },
        { section: 'Theme', path: 'theme.font', type: 'font', label: 'Body font' },

        { section: 'Hero', path: 'hero.name', type: 'text', label: 'Business name' },
        { section: 'Hero', path: 'hero.tagline', type: 'text', label: 'Tagline' },
        { section: 'Hero', path: 'hero.intro', type: 'textarea', label: 'Intro' },
        { section: 'Hero', path: 'hero.image', type: 'image', label: 'Photo' },
        { section: 'Hero', path: 'hero.buttonText', type: 'text', label: 'Call button text' },

        { section: 'Services', path: 'services.heading', type: 'text', label: 'Heading' },
        {
            section: 'Services',
            path: 'services.items',
            type: 'list',
            label: 'Services',
            itemLabel: 'Service',
            itemFields: [
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
            ],
        },

        { section: 'About', path: 'about.heading', type: 'text', label: 'Heading' },
        { section: 'About', path: 'about.text', type: 'textarea', label: 'Text' },

        { section: 'Opening hours', path: 'hours.heading', type: 'text', label: 'Heading' },
        {
            section: 'Opening hours',
            path: 'hours.items',
            type: 'list',
            label: 'Hours',
            itemLabel: 'Day',
            itemFields: [
                { key: 'day', label: 'Days', type: 'text' },
                { key: 'hours', label: 'Hours', type: 'text' },
            ],
        },

        { section: 'Contact', path: 'contact.heading', type: 'text', label: 'Heading' },
        { section: 'Contact', path: 'contact.address', type: 'text', label: 'Address' },
        { section: 'Contact', path: 'contact.phone', type: 'text', label: 'Phone' },
        { section: 'Contact', path: 'contact.email', type: 'email', label: 'Email' },
        { section: 'Contact', path: 'contact.mapUrl', type: 'url', label: 'Google Maps link' },

        { section: 'Social media', path: 'socials', type: 'links', label: 'Links' },
    ],
};

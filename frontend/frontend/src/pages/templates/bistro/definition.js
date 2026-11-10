import Bistro from './Bistro';
import cssText from './bistro.module.css?inline';

export default {
    key: 'bistro',
    name: 'Bistro',
    category: 'food',
    version: 1,
    component: Bistro,
    css: cssText,

    defaultContent: {
        theme: {
            primaryColor: '#9c3d2e',
            backgroundColor: '#fbf7f2',
            textColor: '#2b211c',
            font: 'Outfit',
            headingFont: 'Playfair Display',
        },
        hero: {
            name: 'Bistro Pod Lipą',
            tagline: 'Kuchnia sezonowa w centrum Łodzi',
            image: '',
            buttonText: 'Zarezerwuj stolik',
        },
        about: {
            heading: 'Nasza kuchnia',
            text: 'Gotujemy z produktów od lokalnych dostawców, dlatego karta zmienia się razem z porami roku. W tygodniu zapraszamy na lunch, w weekendy na dłuższe kolacje w ogródku.',
        },
        menu: {
            heading: 'Menu',
            note: 'Karta zmienia się sezonowo. Zapytaj obsługę o danie dnia.',
            items: [
                { name: 'Żurek na zakwasie', description: 'z białą kiełbasą i jajkiem', price: '24 zł' },
                { name: 'Pierogi ruskie', description: '8 sztuk, okrasa z cebulki', price: '32 zł' },
                { name: 'Sałatka z kozim serem', description: 'pieczone buraki, orzechy włoskie, miód', price: '36 zł' },
                { name: 'Policzki wołowe', description: 'purée z pieczonego selera, sos z czerwonego wina', price: '58 zł' },
                { name: 'Sernik baskijski', description: 'z sosem wiśniowym', price: '22 zł' },
                { name: 'Lemoniada domowa', description: 'cytryna, mięta, imbir', price: '14 zł' },
            ],
        },
        gallery: {
            heading: 'Zajrzyj do nas',
            items: [
                { url: '', alt: 'Sala' },
                { url: '', alt: 'Danie dnia' },
                { url: '', alt: 'Ogródek' },
            ],
        },
        hours: {
            heading: 'Godziny otwarcia',
            items: [
                { day: 'Poniedziałek', hours: 'nieczynne' },
                { day: 'Wtorek – czwartek', hours: '12:00 – 22:00' },
                { day: 'Piątek – sobota', hours: '12:00 – 23:00' },
                { day: 'Niedziela', hours: '12:00 – 20:00' },
            ],
        },
        contact: {
            heading: 'Gdzie jesteśmy',
            address: 'ul. Piotrkowska 120, 90-006 Łódź',
            phone: '+48 42 123 45 67',
            email: 'rezerwacje@example.com',
            mapUrl: 'https://maps.google.com',
        },
        socials: [
            { name: 'Instagram', url: 'https://instagram.com' },
            { name: 'Facebook', url: 'https://facebook.com' },
        ],
    },

    fields: [
        { section: 'Theme', path: 'theme.primaryColor', type: 'color', label: 'Accent color' },
        { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
        { section: 'Theme', path: 'theme.textColor', type: 'color', label: 'Text color' },
        { section: 'Theme', path: 'theme.headingFont', type: 'font', label: 'Heading font' },
        { section: 'Theme', path: 'theme.font', type: 'font', label: 'Body font' },

        { section: 'Hero', path: 'hero.name', type: 'text', label: 'Restaurant name' },
        { section: 'Hero', path: 'hero.tagline', type: 'text', label: 'Tagline' },
        { section: 'Hero', path: 'hero.image', type: 'image', label: 'Background photo' },
        { section: 'Hero', path: 'hero.buttonText', type: 'text', label: 'Reservation button text' },

        { section: 'About', path: 'about.heading', type: 'text', label: 'Heading' },
        { section: 'About', path: 'about.text', type: 'textarea', label: 'Text' },

        { section: 'Menu', path: 'menu.heading', type: 'text', label: 'Heading' },
        {
            section: 'Menu',
            path: 'menu.items',
            type: 'list',
            label: 'Dishes',
            itemLabel: 'Dish',
            itemFields: [
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
            ],
        },
        { section: 'Menu', path: 'menu.note', type: 'text', label: 'Note under the menu' },

        { section: 'Gallery', path: 'gallery.heading', type: 'text', label: 'Heading' },
        {
            section: 'Gallery',
            path: 'gallery.items',
            type: 'list',
            label: 'Photos',
            itemLabel: 'Photo',
            itemFields: [
                { key: 'alt', label: 'Caption', type: 'text' },
                { key: 'url', label: 'Photo', type: 'image' },
            ],
        },

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
        { section: 'Contact', path: 'contact.phone', type: 'text', label: 'Phone for reservations' },
        { section: 'Contact', path: 'contact.email', type: 'email', label: 'Email' },
        { section: 'Contact', path: 'contact.mapUrl', type: 'url', label: 'Google Maps link' },

        { section: 'Social media', path: 'socials', type: 'links', label: 'Links' },
    ],
};

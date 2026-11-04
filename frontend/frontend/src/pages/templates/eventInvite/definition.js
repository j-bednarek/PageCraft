import EventInvite from './EventInvite';
import cssText from './eventInvite.module.css?inline';

export default {
    key: 'event_invite',
    name: 'Event Invite',
    category: 'event',
    version: 1,
    component: EventInvite,
    css: cssText,

    defaultContent: {
        theme: {
            primaryColor: '#2f5d50',
            backgroundColor: '#f7f5f0',
            textColor: '#1e2a26',
            font: 'Onest',
            headingFont: 'Instrument Serif',
        },
        hero: {
            eyebrow: 'Zapraszamy na nasz ślub',
            title: 'Anna & Michał',
            date: '12 czerwca 2027, godz. 15:00',
            place: 'Dworek Pod Dębami, okolice Łodzi',
            image: '',
        },
        intro: {
            heading: 'Drodzy Goście',
            text: 'Z radością zapraszamy Was na dzień, na który czekaliśmy długo. Poniżej znajdziecie plan dnia, dojazd i informacje o potwierdzeniu obecności. Do zobaczenia!',
        },
        schedule: {
            heading: 'Plan dnia',
            items: [
                { time: '15:00', title: 'Ceremonia', description: 'W ogrodzie dworku, przy dobrej pogodzie pod gołym niebem.' },
                { time: '16:00', title: 'Życzenia i zdjęcia', description: 'Lampka wina i wspólne zdjęcie wszystkich gości.' },
                { time: '17:00', title: 'Obiad', description: '' },
                { time: '19:00', title: 'Pierwszy taniec', description: 'A potem zabawa do białego rana.' },
            ],
        },
        location: {
            heading: 'Jak dojechać',
            name: 'Dworek Pod Dębami',
            address: 'ul. Leśna 5, 95-001 Okolice Łodzi',
            note: 'Na miejscu jest bezpłatny parking. Dla gości z daleka mamy zarezerwowane pokoje.',
            mapUrl: 'https://maps.google.com',
        },
        rsvp: {
            heading: 'Potwierdź obecność',
            text: 'Prosimy o potwierdzenie do 1 maja 2027 r. Daj znać, czy będziesz z osobą towarzyszącą i czy masz specjalne wymagania dotyczące jedzenia.',
            buttonText: 'Potwierdź przez e-mail',
            email: 'anna.michal@example.com',
            phone: '+48 500 000 000',
        },
    },

    fields: [
        { section: 'Theme', path: 'theme.primaryColor', type: 'color', label: 'Accent color' },
        { section: 'Theme', path: 'theme.backgroundColor', type: 'color', label: 'Background' },
        { section: 'Theme', path: 'theme.textColor', type: 'color', label: 'Text color' },
        { section: 'Theme', path: 'theme.headingFont', type: 'font', label: 'Heading font' },
        { section: 'Theme', path: 'theme.font', type: 'font', label: 'Body font' },

        { section: 'Hero', path: 'hero.eyebrow', type: 'text', label: 'Small text above the title' },
        { section: 'Hero', path: 'hero.title', type: 'text', label: 'Title' },
        { section: 'Hero', path: 'hero.date', type: 'text', label: 'Date and time' },
        { section: 'Hero', path: 'hero.place', type: 'text', label: 'Place' },
        { section: 'Hero', path: 'hero.image', type: 'image', label: 'Photo' },

        { section: 'Welcome', path: 'intro.heading', type: 'text', label: 'Heading' },
        { section: 'Welcome', path: 'intro.text', type: 'textarea', label: 'Text' },

        { section: 'Schedule', path: 'schedule.heading', type: 'text', label: 'Heading' },
        {
            section: 'Schedule',
            path: 'schedule.items',
            type: 'list',
            label: 'Program',
            itemLabel: 'Point',
            itemFields: [
                { key: 'time', label: 'Time', type: 'text' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ],
        },

        { section: 'Location', path: 'location.heading', type: 'text', label: 'Heading' },
        { section: 'Location', path: 'location.name', type: 'text', label: 'Venue name' },
        { section: 'Location', path: 'location.address', type: 'text', label: 'Address' },
        { section: 'Location', path: 'location.note', type: 'textarea', label: 'Note' },
        { section: 'Location', path: 'location.mapUrl', type: 'url', label: 'Google Maps link' },

        { section: 'RSVP', path: 'rsvp.heading', type: 'text', label: 'Heading' },
        { section: 'RSVP', path: 'rsvp.text', type: 'textarea', label: 'Text' },
        { section: 'RSVP', path: 'rsvp.buttonText', type: 'text', label: 'Button text' },
        { section: 'RSVP', path: 'rsvp.email', type: 'email', label: 'Email for replies' },
        { section: 'RSVP', path: 'rsvp.phone', type: 'text', label: 'Phone' },
    ],
};

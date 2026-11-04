import styles from './localBusiness.module.css';
import { fontStack } from '../../../assets/shared/fonts';

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

function telHref(phone = '') {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function LocalBusiness({ content }) {
    const { theme, hero, services, about, hours, contact, socials } = content;

    return (
        <div
            className={styles.page}
            style={{
                '--accent': theme.primaryColor,
                '--bg': theme.backgroundColor,
                '--ink': theme.textColor,
                '--font': fontStack(theme.font),
                '--display': fontStack(theme.headingFont),
            }}
        >
            <header className={styles.topbar}>
                <span className={styles.brand}>{hero.name}</span>
                <nav className={styles.nav}>
                    <a href="#uslugi">{services.heading}</a>
                    <a href="#godziny">{hours.heading}</a>
                    <a href="#kontakt">{contact.heading}</a>
                </nav>
                {contact.phone && (
                    <a className={styles.topbarPhone} href={telHref(contact.phone)}>
                        {contact.phone}
                    </a>
                )}
            </header>

            <section className={styles.hero}>
                <div>
                    {hero.tagline && <p className={styles.tagline}>{hero.tagline}</p>}
                    <h1 className={styles.title}>{hero.name}</h1>
                    {hero.intro && <p className={styles.intro}>{hero.intro}</p>}
                    <div className={styles.actions}>
                        {contact.phone && hero.buttonText && (
                            <a className={styles.buttonPrimary} href={telHref(contact.phone)}>
                                {hero.buttonText}
                            </a>
                        )}
                        <a className={styles.buttonGhost} href="#uslugi">
                            {services.heading}
                        </a>
                    </div>
                </div>
                <div className={styles.photo}>
                    {hero.image ? (
                        <img src={hero.image} alt={hero.name} />
                    ) : (
                        <span className={styles.photoPlaceholder} aria-hidden="true">
                            {initials(hero.name)}
                        </span>
                    )}
                </div>
            </section>

            <section id="uslugi" className={styles.section}>
                <h2 className={styles.sectionTitle}>{services.heading}</h2>
                <ul className={styles.services}>
                    {services.items.map((item, index) => (
                        <li className={styles.service} key={index}>
                            <div>
                                <h3 className={styles.serviceName}>{item.name}</h3>
                                {item.description && <p className={styles.serviceText}>{item.description}</p>}
                            </div>
                            {item.price && <span className={styles.price}>{item.price}</span>}
                        </li>
                    ))}
                </ul>
            </section>

            <section id="godziny" className={`${styles.section} ${styles.split}`}>
                <div>
                    <h2 className={styles.sectionTitle}>{about.heading}</h2>
                    <p className={styles.aboutText}>{about.text}</p>
                </div>
                <div className={styles.hoursCard}>
                    <h2 className={styles.cardTitle}>{hours.heading}</h2>
                    <ul className={styles.hours}>
                        {hours.items.map((item, index) => (
                            <li key={index}>
                                <span>{item.day}</span>
                                <strong>{item.hours}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section id="kontakt" className={styles.section}>
                <div className={styles.contactCard}>
                    <h2 className={styles.contactTitle}>{contact.heading}</h2>
                    <ul className={styles.contactList}>
                        {contact.address && (
                            <li>
                                <span className={styles.contactLabel}>Adres</span>
                                {contact.address}
                            </li>
                        )}
                        {contact.phone && (
                            <li>
                                <span className={styles.contactLabel}>Telefon</span>
                                <a href={telHref(contact.phone)}>{contact.phone}</a>
                            </li>
                        )}
                        {contact.email && (
                            <li>
                                <span className={styles.contactLabel}>E-mail</span>
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            </li>
                        )}
                    </ul>
                    <div className={styles.actions}>
                        {contact.mapUrl && (
                            <a className={styles.buttonLight} href={contact.mapUrl} target="_blank" rel="noreferrer">
                                Pokaż na mapie
                            </a>
                        )}
                        {socials.map((link, index) => (
                            <a className={styles.social} key={index} href={link.url} target="_blank" rel="noreferrer">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                © {new Date().getFullYear()} {hero.name}
            </footer>
        </div>
    );
}

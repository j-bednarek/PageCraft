import styles from './bistro.module.css';
import { fontStack } from '../../../assets/shared/fonts';

function telHref(phone = '') {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function Bistro({ content }) {
    const { theme, hero, about, menu, gallery, hours, contact, socials } = content;

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
            <section
                className={hero.image ? `${styles.hero} ${styles.heroWithImage}` : styles.hero}
                style={hero.image ? { backgroundImage: `url("${hero.image}")` } : undefined}
            >
                <header className={styles.topbar}>
                    <span className={styles.brand}>{hero.name}</span>
                    <nav className={styles.nav}>
                        <a href="#menu">{menu.heading}</a>
                        <a href="#kontakt">{contact.heading}</a>
                    </nav>
                </header>

                <div className={styles.heroInner}>
                    {hero.tagline && <p className={styles.tagline}>{hero.tagline}</p>}
                    <h1 className={styles.title}>{hero.name}</h1>
                    {contact.phone && hero.buttonText && (
                        <a className={styles.button} href={telHref(contact.phone)}>
                            {hero.buttonText}
                        </a>
                    )}
                </div>
            </section>

            <section className={styles.about}>
                <h2 className={styles.sectionTitle}>{about.heading}</h2>
                <p className={styles.aboutText}>{about.text}</p>
            </section>

            <section id="menu" className={styles.menuSection}>
                <h2 className={styles.sectionTitle}>{menu.heading}</h2>
                <ul className={styles.menu}>
                    {menu.items.map((item, index) => (
                        <li className={styles.dish} key={index}>
                            <div className={styles.dishRow}>
                                <span className={styles.dishName}>{item.name}</span>
                                <span className={styles.dots} aria-hidden="true"></span>
                                <span className={styles.dishPrice}>{item.price}</span>
                            </div>
                            {item.description && <p className={styles.dishText}>{item.description}</p>}
                        </li>
                    ))}
                </ul>
                {menu.note && <p className={styles.note}>{menu.note}</p>}
            </section>

            {gallery.items.length > 0 && (
                <section className={styles.gallerySection}>
                    <h2 className={styles.sectionTitle}>{gallery.heading}</h2>
                    <div className={styles.gallery}>
                        {gallery.items.map((photo, index) => (
                            <figure className={styles.tile} key={index}>
                                {photo.url ? (
                                    <img src={photo.url} alt={photo.alt} />
                                ) : (
                                    <span className={styles.tilePlaceholder}>{photo.alt}</span>
                                )}
                            </figure>
                        ))}
                    </div>
                </section>
            )}

            <section id="kontakt" className={styles.info}>
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>{hours.heading}</h2>
                    <ul className={styles.hours}>
                        {hours.items.map((item, index) => (
                            <li key={index}>
                                <span>{item.day}</span>
                                <span>{item.hours}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>{contact.heading}</h2>
                    {contact.address && <p className={styles.address}>{contact.address}</p>}
                    <p className={styles.contactLine}>
                        {contact.phone && <a href={telHref(contact.phone)}>{contact.phone}</a>}
                    </p>
                    <p className={styles.contactLine}>
                        {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                    </p>
                    <div className={styles.links}>
                        {contact.mapUrl && (
                            <a className={styles.linkButton} href={contact.mapUrl} target="_blank" rel="noreferrer">
                                Jak dojechać
                            </a>
                        )}
                        {socials.map((link, index) => (
                            <a className={styles.linkButton} key={index} href={link.url} target="_blank" rel="noreferrer">
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

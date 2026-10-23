import styles from './portfolioMinimal.module.css';
import { fontStack } from '../../../assets/shared/fonts';

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

export default function PortfolioMinimal({ content }) {
    const { theme, hero, about, contact, socials } = content;
    const name = hero.title.text;

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
                <span className={styles.brand}>{name}</span>
                <nav className={styles.nav}>
                    <a href="#about">{about.heading.text}</a>
                    <a href="#contact">{contact.heading}</a>
                </nav>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroText}>
                    {hero.eyebrow && (
                        <p className={styles.eyebrow}>
                            <span className={styles.dot} aria-hidden="true"></span>
                            {hero.eyebrow}
                        </p>
                    )}
                    <h1
                        className={styles.title}
                        style={{
                            fontFamily: fontStack(hero.title.font),
                            color: hero.title.color ?? undefined,
                        }}
                    >
                        {name}
                    </h1>
                    {hero.intro && <p className={styles.intro}>{hero.intro}</p>}
                    <div className={styles.actions}>
                        {hero.buttonText && hero.buttonUrl && (
                            <a className={styles.buttonPrimary} href={hero.buttonUrl} target="_blank" rel="noreferrer">
                                {hero.buttonText}
                            </a>
                        )}
                        <a className={styles.buttonGhost} href="#contact">
                            {contact.heading}
                        </a>
                    </div>
                </div>

                <div className={styles.photoCard}>
                    {hero.image ? (
                        <img className={styles.photo} src={hero.image} alt={name} />
                    ) : (
                        <div className={styles.photoPlaceholder} aria-hidden="true">
                            {initials(name)}
                        </div>
                    )}
                </div>
            </section>

            <section id="about" className={styles.about}>
                <div className={styles.sectionLabel}>01</div>
                <h2
                    className={styles.sectionTitle}
                    style={{
                        fontFamily: fontStack(about.heading.font),
                        color: about.heading.color ?? undefined,
                    }}
                >
                    {about.heading.text}
                </h2>
                <p className={styles.aboutText}>{about.text}</p>
            </section>

            <section id="contact" className={styles.contact}>
                <div className={styles.sectionLabel}>02</div>
                <h2 className={styles.contactTitle}>{contact.heading}</h2>
                {contact.text && <p className={styles.contactText}>{contact.text}</p>}
                {contact.email && (
                    <a className={styles.email} href={`mailto:${contact.email}`}>
                        {contact.email}
                    </a>
                )}
                {socials.length > 0 && (
                    <ul className={styles.socials}>
                        {socials.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noreferrer">
                                    {link.name}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <footer className={styles.footer}>
                <span>© {new Date().getFullYear()} {name}</span>
                <a href="#top" onClick={(e) => { e.preventDefault(); e.currentTarget.ownerDocument.defaultView.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Do góry ↑
                </a>
            </footer>
        </div>
    );
}

import styles from './eventInvite.module.css';
import { fontStack } from '../../../assets/shared/fonts';

function telHref(phone = '') {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function EventInvite({ content }) {
    const { theme, hero, intro, schedule, location, rsvp } = content;
    const mailSubject = encodeURIComponent(`Potwierdzenie obecności: ${hero.title}`);

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
            <section className={styles.hero}>
                {hero.eyebrow && <p className={styles.eyebrow}>{hero.eyebrow}</p>}
                <h1 className={styles.title}>{hero.title}</h1>
                <div className={styles.meta}>
                    {hero.date && <span>{hero.date}</span>}
                    {hero.date && hero.place && <span className={styles.metaDot} aria-hidden="true"></span>}
                    {hero.place && <span>{hero.place}</span>}
                </div>
                {hero.image && (
                    <div className={styles.photo}>
                        <img src={hero.image} alt={hero.title} />
                    </div>
                )}
                <nav className={styles.nav}>
                    <a href="#plan">{schedule.heading}</a>
                    <a href="#miejsce">{location.heading}</a>
                    <a href="#rsvp">{rsvp.heading}</a>
                </nav>
            </section>

            <section className={styles.intro}>
                <h2 className={styles.sectionTitle}>{intro.heading}</h2>
                <p className={styles.introText}>{intro.text}</p>
            </section>

            <section id="plan" className={styles.section}>
                <h2 className={styles.sectionTitle}>{schedule.heading}</h2>
                <ol className={styles.timeline}>
                    {schedule.items.map((item, index) => (
                        <li className={styles.step} key={index}>
                            <span className={styles.time}>{item.time}</span>
                            <div className={styles.stepBody}>
                                <h3 className={styles.stepTitle}>{item.title}</h3>
                                {item.description && <p className={styles.stepText}>{item.description}</p>}
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section id="miejsce" className={styles.section}>
                <div className={styles.locationCard}>
                    <h2 className={styles.sectionTitle}>{location.heading}</h2>
                    <p className={styles.venue}>{location.name}</p>
                    {location.address && <p className={styles.address}>{location.address}</p>}
                    {location.note && <p className={styles.note}>{location.note}</p>}
                    {location.mapUrl && (
                        <a className={styles.buttonGhost} href={location.mapUrl} target="_blank" rel="noreferrer">
                            Otwórz mapę
                        </a>
                    )}
                </div>
            </section>

            <section id="rsvp" className={styles.rsvp}>
                <h2 className={styles.rsvpTitle}>{rsvp.heading}</h2>
                {rsvp.text && <p className={styles.rsvpText}>{rsvp.text}</p>}
                <div className={styles.rsvpActions}>
                    {rsvp.email && rsvp.buttonText && (
                        <a className={styles.button} href={`mailto:${rsvp.email}?subject=${mailSubject}`}>
                            {rsvp.buttonText}
                        </a>
                    )}
                    {rsvp.phone && (
                        <a className={styles.phone} href={telHref(rsvp.phone)}>
                            {rsvp.phone}
                        </a>
                    )}
                </div>
            </section>

            <footer className={styles.footer}>{hero.title}</footer>
        </div>
    );
}

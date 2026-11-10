import styles from './resumeClassic.module.css';
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

function displayUrl(url = '') {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function ResumeClassic({ content }) {
    const { theme, profile, contact, experience, education, skills, links } = content;

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
            <div className={styles.sheet}>
                <header className={styles.header}>
                    <div className={styles.photo}>
                        {profile.photo ? (
                            <img src={profile.photo} alt={profile.name} />
                        ) : (
                            <span aria-hidden="true">{initials(profile.name)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className={styles.name}>{profile.name}</h1>
                        {profile.role && <p className={styles.role}>{profile.role}</p>}
                    </div>
                </header>

                <div className={styles.columns}>
                    <aside className={styles.sidebar}>
                        <section>
                            <h2 className={styles.sideTitle}>Kontakt</h2>
                            <ul className={styles.contact}>
                                {contact.email && <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
                                {contact.phone && <li><a href={telHref(contact.phone)}>{contact.phone}</a></li>}
                                {contact.location && <li>{contact.location}</li>}
                                {contact.website && (
                                    <li>
                                        <a href={contact.website} target="_blank" rel="noreferrer">
                                            {displayUrl(contact.website)}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </section>

                        {skills.items.length > 0 && (
                            <section>
                                <h2 className={styles.sideTitle}>{skills.heading}</h2>
                                <ul className={styles.skills}>
                                    {skills.items.map((skill, index) => (
                                        <li key={index}>{skill.name}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {links.length > 0 && (
                            <section>
                                <h2 className={styles.sideTitle}>Linki</h2>
                                <ul className={styles.contact}>
                                    {links.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </aside>

                    <main className={styles.main}>
                        {profile.summary && <p className={styles.summary}>{profile.summary}</p>}

                        <section className={styles.block}>
                            <h2 className={styles.blockTitle}>{experience.heading}</h2>
                            <ul className={styles.entries}>
                                {experience.items.map((job, index) => (
                                    <li className={styles.entry} key={index}>
                                        <div className={styles.entryHead}>
                                            <h3 className={styles.entryTitle}>{job.role}</h3>
                                            <span className={styles.period}>{job.period}</span>
                                        </div>
                                        {job.company && <p className={styles.entryPlace}>{job.company}</p>}
                                        {job.description && <p className={styles.entryText}>{job.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.block}>
                            <h2 className={styles.blockTitle}>{education.heading}</h2>
                            <ul className={styles.entries}>
                                {education.items.map((school, index) => (
                                    <li className={styles.entry} key={index}>
                                        <div className={styles.entryHead}>
                                            <h3 className={styles.entryTitle}>{school.school}</h3>
                                            <span className={styles.period}>{school.period}</span>
                                        </div>
                                        {school.degree && <p className={styles.entryPlace}>{school.degree}</p>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}

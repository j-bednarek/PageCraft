import styles from './portfolioMinimal.module.css';
export default function PortfolioMinimal({ content }) {
    const { theme, hero, about, socials } = content;

    return (
        <div className={styles.page} style={{
              '--primary': theme.primaryColor,
        '--bg': theme.backgroundColor,
        '--text': theme.textColor,
        '--font': theme.font,
        }}>

            <div className={styles.hero}>
                <h1 style={{
                    fontFamily: hero.title.font ?? undefined,
                    color: hero.title.color ?? undefined,
                }}>
                    {hero.title.text}
                </h1>
                <p>
                    {hero.subtitle}
                </p>

               {hero.image
    ? <img src={hero.image} alt={hero.title.text} className={styles.photo} />
    : <div className={styles.photoPlaceholder} aria-hidden="true"></div>}

                <a href={hero.buttonUrl} target="_blank" rel="noreferrer" className={styles.button}>
                    {hero.buttonText}
                </a>
            </div>

            <div className={styles.about}>
                <h2 style={{
                    fontFamily: about.heading.font ?? undefined,
                    color: about.heading.color ?? undefined,
                }}>
                    {about.heading.text}
                </h2>
                <p >
                    {about.text}
                </p>
            </div>

            {socials.length > 0 && (
                <div className={styles.socials}>
                    <h2>Social media</h2>

                <footer>
                    {socials.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.button}
                        >
                            {link.name}
                        </a>
                    ))}
                </footer>
            </div>
        )}
        </div>
    );
}

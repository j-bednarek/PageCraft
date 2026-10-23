export default function LinksField({ label, value, onChange }) {
    const links = value ?? [];

    const updateLink = (index, key, newValue) => {
        onChange(links.map((link, i) => (i === index ? { ...link, [key]: newValue } : link)));
    };

    const removeLink = (index) => {
        onChange(links.filter((_, i) => i !== index));
    };

    const addLink = () => {
        onChange([...links, { name: '', url: 'https://' }]);
    };

    return (
        <div className="ed-field">
            <span className="ed-label">{label}</span>

            {links.length === 0 && <p className="ed-empty">No links yet.</p>}

            <div className="ed-links">
                {links.map((link, index) => (
                    <div className="ed-link-item" key={index}>
                        <div className="ed-link-inputs">
                            <input
                                className="ed-input"
                                type="text"
                                placeholder="Name, e.g. GitHub"
                                value={link.name}
                                aria-label={`Link ${index + 1} name`}
                                onChange={(e) => updateLink(index, 'name', e.target.value)}
                            />
                            <input
                                className="ed-input"
                                type="url"
                                placeholder="https://"
                                value={link.url}
                                aria-label={`Link ${index + 1} address`}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                            />
                            {link.url && !link.url.startsWith('https://') && (
                                <span className="ed-hint">Link should start with https://</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="ed-icon-button"
                            aria-label={`Remove link ${index + 1}`}
                            onClick={() => removeLink(index)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="ed-add-button" onClick={addLink}>
                <i className="fa-solid fa-plus"></i> Add link
            </button>
        </div>
    );
}

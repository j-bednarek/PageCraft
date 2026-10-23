export default function ImageField({ label, value, onChange }) {
    const url = value ?? '';

    return (
        <div className="ed-field">
            <span className="ed-label">{label}</span>
            <div className="ed-image">
                <div className="ed-image-preview">
                    {url ? <img src={url} alt="" /> : <i className="fa-regular fa-image" aria-hidden="true"></i>}
                </div>
                <div className="ed-image-body">
                    <input
                        className="ed-input"
                        type="url"
                        placeholder="https://… image link"
                        value={url}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <div className="ed-image-actions">
                        <span className="ed-hint">Uploading from your computer is coming soon.</span>
                        {url && (
                            <button type="button" className="ed-link-button" onClick={() => onChange('')}>
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

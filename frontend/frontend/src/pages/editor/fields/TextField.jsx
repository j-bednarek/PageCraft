export default function TextField({ label, value, onChange, type = 'text' }) {
    const inputType = type === 'url' || type === 'email' ? type : 'text';
    const text = value ?? '';
    const showUrlHint = type === 'url' && text !== '' && !text.startsWith('https://');

    return (
        <label className="ed-field">
            <span className="ed-label">{label}</span>
            <input
                className="ed-input"
                type={inputType}
                value={text}
                placeholder={type === 'url' ? 'https://' : ''}
                onChange={(e) => onChange(e.target.value)}
            />
            {showUrlHint && <span className="ed-hint">Link should start with https://</span>}
        </label>
    );
}

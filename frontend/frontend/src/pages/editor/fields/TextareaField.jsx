export default function TextareaField({ label, value, onChange }) {
    return (
        <label className="ed-field">
            <span className="ed-label">{label}</span>
            <textarea
                className="ed-input ed-textarea"
                rows={4}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

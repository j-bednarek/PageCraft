export default function TextField({ label, value, onChange }) {
    return (
        <label>
            {label}
            <input
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

export default function ColorField({ label, value, onChange }) {
    return (
        <label>
            {label}
            <input
                type="color"
                value={value ?? '#000000'}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

export default function ColorField({ label, value, onChange }) {
    const color = value ?? '#000000';

    return (
        <div className="ed-field ed-field-row">
            <span className="ed-label">{label}</span>
            <label className="ed-color">
                <span className="ed-swatch" style={{ background: color }}></span>
                <span className="ed-color-value">{color.toUpperCase()}</span>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    aria-label={label}
                />
            </label>
        </div>
    );
}

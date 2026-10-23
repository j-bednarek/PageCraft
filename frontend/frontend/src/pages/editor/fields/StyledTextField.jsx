import { FONTS } from '../../../assets/shared/fonts';

export default function StyledTextField({ label, value, onChange }) {
    const field = value ?? {};
    const hasStyle = field.font || field.color;

    return (
        <div className="ed-field">
            <span className="ed-label">{label}</span>
            <input
                className="ed-input"
                type="text"
                value={field.text ?? ''}
                onChange={(e) => onChange({ ...field, text: e.target.value })}
            />
            <div className="ed-style-row">
                <select
                    className="ed-input ed-select ed-select-sm"
                    value={field.font ?? ''}
                    aria-label={`${label} font`}
                    onChange={(e) => onChange({ ...field, font: e.target.value || null })}
                >
                    <option value="">Theme font</option>
                    {FONTS.map((font) => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                    ))}
                </select>

                <label className="ed-color ed-color-sm" title="Text color">
                    <span
                        className={field.color ? 'ed-swatch' : 'ed-swatch ed-swatch-empty'}
                        style={{ background: field.color ?? undefined }}
                    ></span>
                    <span className="ed-color-value">{field.color ? field.color.toUpperCase() : 'Theme'}</span>
                    <input
                        type="color"
                        value={field.color ?? '#16212f'}
                        aria-label={`${label} color`}
                        onChange={(e) => onChange({ ...field, color: e.target.value })}
                    />
                </label>

                {hasStyle && (
                    <button
                        type="button"
                        className="ed-link-button"
                        onClick={() => onChange({ ...field, font: null, color: null })}
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}

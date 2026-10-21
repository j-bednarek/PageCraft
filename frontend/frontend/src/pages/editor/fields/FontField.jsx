import { FONTS, fontStack } from '../../../assets/shared/fonts';

export default function FontField({ label, value, onChange, allowInherit = false }) {
    return (
        <label className="ed-field">
            <span className="ed-label">{label}</span>
            <select
                className="ed-input ed-select"
                value={value ?? ''}
                style={{ fontFamily: fontStack(value) }}
                onChange={(e) => onChange(e.target.value || null)}
            >
                {allowInherit && <option value="">Theme font</option>}
                {FONTS.map((font) => (
                    <option key={font.name} value={font.name} style={{ fontFamily: font.stack }}>
                        {font.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

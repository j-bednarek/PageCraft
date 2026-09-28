export default function StyledTextField({ label, value, onChange }) {
    const field = value ?? {};

    return (
        <fieldset>
            <legend>{label}</legend>

            <label>
                Tekst
                <input
                    type="text"
                    value={field.text ?? ''}
                    onChange={(e) =>
                        onChange({ ...field, text: e.target.value })
                    }
                />
            </label>

            <label>
                Czcionka
                <input
                    type="text"
                    value={field.font ?? ''}
                    onChange={(e) =>
                        onChange({ ...field, font: e.target.value || null })
                    }
                />
            </label>

            <label>
                Kolor
                <input
                    type="color"
                    value={field.color ?? '#ffffff'}
                    onChange={(e) =>
                        onChange({ ...field, color: e.target.value })
                    }
                />
            </label>

            <button
                type="button"
                onClick={() =>
                    onChange({ ...field, font: null, color: null })
                }
            >
                Reset style
            </button>
        </fieldset>
    );
}

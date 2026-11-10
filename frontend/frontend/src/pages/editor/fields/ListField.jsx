import TextField from './TextField';
import TextareaField from './TextareaField';
import ImageField from './ImageField';

const SUBFIELDS = {
    text: TextField,
    url: TextField,
    email: TextField,
    textarea: TextareaField,
    image: ImageField,
};

function emptyItem(itemFields) {
    return Object.fromEntries(itemFields.map((f) => [f.key, '']));
}

export default function ListField({ label, value, onChange, field }) {
    const items = value ?? [];
    const itemFields = field?.itemFields ?? [];
    const itemLabel = field?.itemLabel ?? 'Item';
    const titleKey = itemFields[0]?.key;

    const updateItem = (index, key, newValue) => {
        onChange(items.map((item, i) => (i === index ? { ...item, [key]: newValue } : item)));
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const moveItem = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        const copy = [...items];
        [copy[index], copy[target]] = [copy[target], copy[index]];
        onChange(copy);
    };

    const addItem = () => {
        onChange([...items, emptyItem(itemFields)]);
    };

    return (
        <div className="ed-field">
            <span className="ed-label">{label}</span>

            {items.length === 0 && <p className="ed-empty">Nothing here yet.</p>}

            <div className="ed-list">
                {items.map((item, index) => (
                    <details className="ed-list-item" key={index}>
                        <summary className="ed-list-summary">
                            <span className="ed-list-title">
                                {(titleKey && item[titleKey]) || `${itemLabel} ${index + 1}`}
                            </span>
                            <span className="ed-list-actions">
                                <button
                                    type="button"
                                    className="ed-icon-button"
                                    aria-label={`Move ${itemLabel} ${index + 1} up`}
                                    disabled={index === 0}
                                    onClick={(e) => { e.preventDefault(); moveItem(index, -1); }}
                                >
                                    <i className="fa-solid fa-arrow-up"></i>
                                </button>
                                <button
                                    type="button"
                                    className="ed-icon-button"
                                    aria-label={`Move ${itemLabel} ${index + 1} down`}
                                    disabled={index === items.length - 1}
                                    onClick={(e) => { e.preventDefault(); moveItem(index, 1); }}
                                >
                                    <i className="fa-solid fa-arrow-down"></i>
                                </button>
                                <button
                                    type="button"
                                    className="ed-icon-button"
                                    aria-label={`Remove ${itemLabel} ${index + 1}`}
                                    onClick={(e) => { e.preventDefault(); removeItem(index); }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </span>
                        </summary>

                        <div className="ed-list-body">
                            {itemFields.map((sub) => {
                                const SubField = SUBFIELDS[sub.type] ?? TextField;
                                return (
                                    <SubField
                                        key={sub.key}
                                        label={sub.label}
                                        type={sub.type}
                                        value={item[sub.key]}
                                        onChange={(newValue) => updateItem(index, sub.key, newValue)}
                                    />
                                );
                            })}
                        </div>
                    </details>
                ))}
            </div>

            <button type="button" className="ed-add-button" onClick={addItem}>
                <i className="fa-solid fa-plus"></i> Add {itemLabel.toLowerCase()}
            </button>
        </div>
    );
}

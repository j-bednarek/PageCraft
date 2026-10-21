import fieldTypes from './fields/fieldTypes';
import { getIn } from './contentState';

export default function PageEdit({ fields, content, dispatch }) {
    const sections = [...new Set(fields.map((f) => f.section))];

    return (
        <div className="ed-sections">
            {sections.map((section, index) => (
                <details key={section} className="ed-section" open={index < 2}>
                    <summary className="ed-section-title">
                        <span>{section}</span>
                        <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </summary>

                    <div className="ed-section-body">
                        {fields
                            .filter((f) => f.section === section)
                            .map((field) => {
                                const FieldComponent = fieldTypes[field.type];
                                if (!FieldComponent) return null;

                                return (
                                    <FieldComponent
                                        key={field.path}
                                        label={field.label}
                                        type={field.type}
                                        value={getIn(content, field.path)}
                                        onChange={(value) =>
                                            dispatch({ type: 'set', path: field.path, value })
                                        }
                                    />
                                );
                            })}
                    </div>
                </details>
            ))}
        </div>
    );
}

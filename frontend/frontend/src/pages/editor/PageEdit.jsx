import fieldTypes from './fields/fieldTypes';
import { getIn } from './contentState';

export default function PageEdit({ fields, content, dispatch }) {
    const sections = [...new Set(fields.map((f) => f.section))];

    return (
        <div>
            {sections.map((section) => (
                <section key={section}>
                    <h2>{section}</h2>

                    {fields
                        .filter((f) => f.section === section)
                        .map((field) => {
                            const FieldComponent = fieldTypes[field.type];

                            if (!FieldComponent) {
                                return null;
                            }

                            return (
                                <FieldComponent
                                    key={field.path}
                                    label={field.label}
                                    value={getIn(content, field.path)}
                                    onChange={(value) =>
                                        dispatch({
                                            type: 'set',
                                            path: field.path,
                                            value,
                                        })
                                    }
                                />
                            );
                        })}
                </section>
            ))}
        </div>
    );
}

import { useReducer } from 'react';
import { getTemplate } from '../templates/registry';
import { contentReducer } from './contentState';
import PageEdit from './PageEdit';

import './editor.css';

export default function Editor() {
    const template = getTemplate('portfolio_minimal');

    const [content, dispatch] = useReducer(
        contentReducer,
        template.defaultContent
    );

    const Template = template.component;

    return (
        <div className="editor">
            <div className="editor__sidebar">
                <PageEdit
                    fields={template.fields}
                    content={content}
                    dispatch={dispatch}
                />
            </div>

            <div className="editor__preview">
                <Template content={content} />
            </div>
        </div>
    );
}

import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';

import { contentReducer, withDefaults } from './contentState';
import PreviewFrame from './PreviewFrame';
import PageEdit from './PageEdit';
import { GOOGLE_FONTS_URL } from '../../assets/shared/fonts';

import './editor.css';

const DEVICES = [
    { key: 'desktop', label: 'Desktop', icon: 'fa-solid fa-desktop' },
    { key: 'mobile', label: 'Mobile', icon: 'fa-solid fa-mobile-screen' },
];

export default function Editor({ template , page }) {
    const [device, setDevice] = useState('desktop');
    const [content, dispatch] = useReducer(
    contentReducer,
    page.content,
    (saved) => withDefaults(template.defaultContent, saved)
);

    const Template = template.component;

    useEffect(() => {
        if (document.getElementById('editor-fonts')) return;
        const link = document.createElement('link');
        link.id = 'editor-fonts';
        link.rel = 'stylesheet';
        link.href = GOOGLE_FONTS_URL;
        document.head.appendChild(link);
    }, []);

    return (
        <div className="ed">
            <header className="ed-topbar">
                <div className="ed-topbar-left">
                    <Link to="/account" className="ed-back">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>My pages</span>
                    </Link>
                    <span className="ed-divider" aria-hidden="true"></span>
                    <div className="ed-doc">
                        <span className="ed-doc-name">{template.name}</span>
                        <span className="ed-badge">Draft</span>
                    </div>
                </div>

                <div className="ed-devices" role="group" aria-label="Preview size">
                    {DEVICES.map((d) => (
                        <button
                            key={d.key}
                            type="button"
                            className={device === d.key ? 'ed-device active' : 'ed-device'}
                            aria-pressed={device === d.key}
                            onClick={() => setDevice(d.key)}
                        >
                            <i className={d.icon}></i>
                            <span>{d.label}</span>
                        </button>
                    ))}
                </div>

                <div className="ed-topbar-right">
                    <button
                        type="button"
                        className="ed-button-secondary"
                        onClick={() => {
                            if (window.confirm('Reset all changes to the template defaults?')) {
                                dispatch({ type: 'reset', content: template.defaultContent });
                            }
                        }}
                    >
                        Reset
                    </button>
                    <button type="button" className="ed-button-primary" disabled title="Publishing is coming soon">
                        Publish
                    </button>
                </div>
            </header>

            <aside className="ed-sidebar">
                <div className="ed-sidebar-head">
                    <h1>Edit page</h1>
                    <p>Changes appear in the preview instantly.</p>
                </div>
                <PageEdit fields={template.fields} content={content} dispatch={dispatch} />
            </aside>

            <main className="ed-canvas">
                <div className={`ed-frame ed-frame-${device}`}>
                    <PreviewFrame css={template.css}>
                        <Template content={content} />
                    </PreviewFrame>
                </div>
            </main>
        </div>
    );
}

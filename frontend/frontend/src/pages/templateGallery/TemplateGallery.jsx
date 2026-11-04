import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { getTemplate } from '../templates/registry';
import './templateGallery.css';

const CATEGORY_LABELS = {
    all: 'All',
    portfolio: 'Portfolio',
    business: 'Business',
    food: 'Food & drink',
    event: 'Events',
    resume: 'Resume',
};

function categoryLabel(category) {
    return CATEGORY_LABELS[category] ?? category;
}

function TemplateThumb({ template }) {
    if (!template.definition) {
        return (
            <div className="tg-thumb tg-thumb-empty" aria-hidden="true">
                <span>{template.name}</span>
            </div>
        );
    }

    return (
        <div className="tg-thumb">
            <img src={template.definition.thumbnail} alt="" loading="lazy" />
        </div>
    );
}

export default function TemplateGallery() {
    const [templates, setTemplates] = useState(null);
    const [error, setError] = useState('');
const [category, setCategory] = useState('all');

const categories = templates ? ['all', ...new Set(templates.map((t) => t.category))] : [];
const visible = templates ? templates.filter((t) => t.category === category || category === 'all') : [];
    useEffect(() => {
        document.body.classList.add('light-page');
        return () => document.body.classList.remove('light-page');
    }, []);

    useEffect(() => {
        let ignore = false;
        api.get('/templates')
            .then((response) => {
                if (ignore) return;
                const available = response.data
                    .map((t) => ({ ...t, definition: getTemplate(t.component_key) }))
                    .filter((t) => t.definition);
                setTemplates(available);
            })
            .catch((err) => { if (!ignore) setError(getErrorMessage(err)); });
        return () => { ignore = true; };
    }, []);

    return (
        <div className="tg-page">
            <header className="tg-head">
                <h1>Pick a template</h1>
                <p>Every template can be changed later: texts, photos, colors and fonts.</p>
            </header>

            {error && <div className="tg-error">{error}</div>}
            {!error && templates === null && <p className="tg-loading">Loading templates…</p>}

           {categories.length > 0 && (
    <div className="tg-filters" role="group" aria-label="Filter by category">
        {categories.map((c) => (
            <button
                key={c}
                type="button"
                className={category === c ? 'tg-filter tg-filter-active' : 'tg-filter'}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
            >
                {categoryLabel(c)}
            </button>
        ))}
    </div>
)}

<div className="tg-grid">
    {visible.map((template) => (
        <article className="tg-card" key={template.id}>
            <button type="button" className="tg-card-preview">
                <TemplateThumb template={template} />
                <span className="tg-sr-only">Preview {template.name}</span>
            </button>
            <div className="tg-card-body">
                <div>
                    <h2>{template.name}</h2>
                    <span className="tg-category">{categoryLabel(template.category)}</span>
                </div>
                <button type="button" className="tg-use">Use template</button>
            </div>
        </article>
    ))}
</div>
        </div>
    );
}
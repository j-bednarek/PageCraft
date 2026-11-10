import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { getTemplate } from '../templates/registry';
import './templateGallery.css';
import { createPortal } from 'react-dom';
import PreviewFrame from '../editor/PreviewFrame';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../assets/components/AuthModal';
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
    if (!template.thumbnail_url) {
        return (
            <div className="tg-thumb tg-thumb-empty" aria-hidden="true">
                <span>{template.name}</span>
            </div>
        );
    }

    return (
        <div className="tg-thumb">
            <img src={template.thumbnail_url} alt="" loading="lazy" />
        </div>
    );
}


function PreviewModal({ template, onClose, onUse, isCreating }) {
    const Template = template.definition.component;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    return createPortal(
        <div className="tg-overlay" onClick={onClose}>
            <div
                className="tg-modal"
                role="dialog"
                aria-modal="true"
                aria-label={template.name}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="tg-modal-head">
                    <div>
                        <h2>{template.name}</h2>
                        <span className="tg-category">{categoryLabel(template.category)}</span>
                    </div>
                    <div className="tg-modal-actions">
                        <button type="button" className="cta-button tg-btn" onClick={onUse} disabled={isCreating}>
                            {isCreating ? 'Creating…' : 'Use template'}
                        </button>
                        <button type="button" className="tg-close" aria-label="Close preview" onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </header>
                <div className="tg-modal-body">
                    <PreviewFrame css={template.definition.css}>
                        <Template content={template.definition.defaultContent} />
                    </PreviewFrame>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default function TemplateGallery() {
    const [templates, setTemplates] = useState(null);
    const [error, setError] = useState('');
const [category, setCategory] = useState('all');
const [previewed, setPreviewed] = useState(null);
const categories = templates ? ['all', ...new Set(templates.map((t) => t.category))] : [];
const visible = templates ? templates.filter((t) => t.category === category || category === 'all') : [];


const navigate = useNavigate();
const { user } = useAuth();
const [pendingKey, setPendingKey] = useState(null);
const [authMode, setAuthMode] = useState(null);
const [isCreating, setIsCreating] = useState(false);
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
    async function createPage(templateKey) {
    setIsCreating(true);
    setError('');
    try {
        const response = await api.post('/pages', { templateKey });
        navigate(`/editor/${response.data.page.id}`);
    } catch (err) {
        setError(getErrorMessage(err));
        setIsCreating(false);
        setPreviewed(null);
    }
}

function chooseTemplate(templateKey) {
    if (!user) {
        setPreviewed(null);
        setPendingKey(templateKey);
        setAuthMode('login');
        return;
    }
    createPage(templateKey);
}

function handleAuthSuccess() {
    setAuthMode(null);
    if (pendingKey) {
        createPage(pendingKey);
    }
}

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
                className={category === c ? 'tg-filter active' : 'tg-filter'}
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
            
<button type="button" className="tg-card-preview" onClick={() => setPreviewed(template)}>
                <TemplateThumb template={template} />
                <span className="tg-sr-only">Preview {template.name}</span>
            </button>
            <div className="tg-card-body">
                <div>
                    <h2>{template.name}</h2>
                    <span className="tg-category">{categoryLabel(template.category)}</span>
                </div>
                <button
    type="button"
    className="tg-use"
    onClick={() => chooseTemplate(template.component_key)}
    disabled={isCreating}
>
    Use template
</button>
            </div>
        </article>
    ))}
    
</div>
{previewed && (
    <PreviewModal
        template={previewed}
        onClose={() => setPreviewed(null)}
        onUse={() => chooseTemplate(previewed.component_key)}
        isCreating={isCreating}
    />
)}
{authMode && (
    <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitch={setAuthMode}
        onSuccess={handleAuthSuccess}
    />
)}
        </div>
    );
}
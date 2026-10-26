import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { formatDate } from './format';

function UsageCard({ label, used, limit, hint }) {
    const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
    return (
        <div className="acc-card acc-usage">
            <span className="acc-label">{label}</span>
            <div className="acc-usage-value">
                <strong>{used}</strong> <span>of {limit}</span>
            </div>
            <div className="acc-progress" aria-hidden="true">
                <div className="acc-progress-fill" style={{ width: `${percent}%` }}></div>
            </div>
            {hint && <span className="acc-hint">{hint}</span>}
        </div>
    );
}

export default function PagesTab({ usage }) {
    const navigate = useNavigate();
    const [pages, setPages] = useState(null);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    useEffect(() => {
        let ignore = false;
        api.get('/pages/my-projects')
            .then((response) => { if (!ignore) setPages(response.data); })
            .catch((err) => { if (!ignore) setError(getErrorMessage(err)); });
        return () => { ignore = true; };
    }, []);
    async function createPage() {
    setIsCreating(true);
    setError('');
    try {
        const response = await api.post('/pages', { templateKey: 'portfolio_minimal' });
        navigate(`/editor/${response.data.id}`);
    } catch (err) {
        setError(getErrorMessage(err));
        setIsCreating(false);
    }
}

async function deletePage(page) {
    if (!window.confirm(`Delete "${page.title}"? This cannot be undone.`)) {
        return;
    }
    try {
        await api.delete(`/pages/${page.id}`);
        setPages((current) => current.filter((p) => p.id !== page.id));
    } catch (err) {
        setError(getErrorMessage(err));
    }
}
const published = pages ? pages.filter((p) => p.status).length : usage.published;
const drafts = pages ? pages.filter((p) => !p.status).length : usage.drafts;
    return (
        <div className="acc-stack">
            <div className="acc-section-head">
                <div className="acc-section-head acc-section-head-row">
                <h2>My pages</h2>
                <p className="acc-subtle">Everything you have built, published or not.</p>
                </div>
                <button type="button" className="cta-button acc-btn" onClick={createPage} disabled={isCreating}>
                {isCreating ? 'Creating…' : 'New page'}
                </button>
            </div>

            <div className="acc-usage-grid">
                <UsageCard
                    label="Published pages"
                    used={published}
                    limit={usage.publishedLimit}
                    hint={usage.publishedLimit === 0 ? 'Upgrade your plan to publish a page.' : null}
                />
                <UsageCard label="Drafts" used={drafts} limit={usage.draftLimit} />
            </div>

            {error && <div className="acc-message acc-message-error">{error}</div>}

            {!error && pages === null && <div className="acc-loading">Loading pages…</div>}

            {pages && pages.length === 0 && (
                <div className="acc-card acc-empty">
                    <div className="acc-empty-icon">
                        <i className="fa-regular fa-file-lines"></i>
                    </div>
                    <h3>You don't have any pages yet</h3>
                    <p className="acc-subtle">
                        Pick a template and have your first one-page site ready in a few minutes.
                    </p>
                    <div className="acc-actions">
                        <button type="button" className="cta-button acc-btn" onClick={createPage} disabled={isCreating}>
    {isCreating ? 'Creating…' : 'New page'}
</button>
                        <Link to="/templates" className="acc-btn acc-btn-secondary">Browse templates</Link>
                    </div>
                </div>
            )}

            {pages && pages.length > 0 && (
                <div className="acc-card acc-list">
                    {pages.map((page) => (
                        <div className="acc-list-row" key={page.id}>
                            <div className="acc-thumb" aria-hidden="true">
                                {page.templates?.thumbnail_url
                                    ? <img src={page.templates.thumbnail_url} alt="" />
                                    : <i className="fa-regular fa-file"></i>}
                            </div>
                            <div className="acc-list-main">
                                <strong>{page.title}</strong>
                                <span className="acc-subtle acc-mono">
                                    {page.slug ? `pagecraft.pl/${page.slug}` : 'No address yet'}
                                </span>
                            </div>
                            <span className={page.status ? 'acc-pill acc-pill-live' : 'acc-pill'}>
                                {page.status ? 'Published' : 'Draft'}
                            </span>
                            <span className="acc-subtle acc-list-date">
                                Updated {formatDate(page.updated_at)}
                            </span>
                            <div className="acc-row-actions">
    <Link to={`/editor/${page.id}`} className="acc-btn acc-btn-secondary">Edit</Link>
    <button type="button" className="acc-btn acc-btn-danger" onClick={() => deletePage(page)}>
        Delete
    </button>
</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

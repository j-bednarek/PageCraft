import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';

const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;
const CHECK_DELAY = 400;

function slugify(text) {
    return text
        .toLowerCase()
        .replaceAll('ł', 'l')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40)
        .replace(/-+$/, '');
}

export default function PublishModal({ pageId, title, publication, onClose, onChange }) {
    const [slug, setSlug] = useState(publication.slug ?? slugify(title));
    const [checkResult, setCheckResult] = useState(null);
    const [error, setError] = useState('');
    const [isPlanLimit, setIsPlanLimit] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

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

    useEffect(() => {
        if (!slug) return;
        let ignore = false;
        const timer = setTimeout(() => {
            api.get('/slugs/check', { params: { slug, pageId } })
                .then((response) => { if (!ignore) setCheckResult({ slug, ...response.data }); })
                .catch((err) => {
                    if (!ignore) setCheckResult({ slug, available: false, message: getErrorMessage(err) });
                });
        }, CHECK_DELAY);
        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [slug, pageId]);

    const check = checkResult?.slug === slug ? checkResult : null;
    const canPublish = Boolean(check?.available) && !isBusy;
    const liveUrl = publication.status ? `${SITE_URL}/${publication.slug}` : null;

    async function publish() {
        setIsBusy(true);
        setError('');
        setIsPlanLimit(false);
        try {
            const response = await api.post(`/pages/${pageId}/publish`, { slug });
            onChange(response.data.page);
        } catch (err) {
            setError(getErrorMessage(err));
            setIsPlanLimit(err.response?.data?.code === 'PLAN_LIMIT');
        } finally {
            setIsBusy(false);
        }
    }

    async function unpublish() {
        setIsBusy(true);
        setError('');
        try {
            const response = await api.post(`/pages/${pageId}/unpublish`);
            onChange(response.data.page);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <div className="ed-modal-overlay" onClick={onClose}>
            <div
                className="ed-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="publish-title"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="ed-modal-head">
                    <h2 id="publish-title">{publication.status ? 'Your page is live' : 'Publish your page'}</h2>
                    <button type="button" className="ed-icon-button" aria-label="Close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                {liveUrl && (
                    <a className="ed-live-link" href={liveUrl} target="_blank" rel="noreferrer">
                        {liveUrl} <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                )}

                <label className="ed-label" htmlFor="publish-slug">Page address</label>
                <div className="ed-slug">
                    <span className="ed-slug-host">pagecraft.pl/</span>
                    <input
                        id="publish-slug"
                        className="ed-slug-input"
                        value={slug}
                        maxLength={40}
                        autoComplete="off"
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    />
                </div>
                <p className={check?.available ? 'ed-slug-status ok' : 'ed-slug-status'} aria-live="polite">
                    {!slug && 'Type an address for your page.'}
                    {slug && !check && 'Checking…'}
                    {check?.available && 'This address is available.'}
                    {check && !check.available && check.message}
                </p>

                {error && (
                    <div className="ed-modal-error" role="alert">
                        {error}
                        {isPlanLimit && <> <Link to="/account?tab=plan">See plans</Link></>}
                    </div>
                )}

                <div className="ed-modal-actions">
                    {publication.status && (
                        <button type="button" className="ed-button-secondary" onClick={unpublish} disabled={isBusy}>
                            Unpublish
                        </button>
                    )}
                    <button type="button" className="ed-button-primary" onClick={publish} disabled={!canPublish}>
                        {isBusy ? 'Publishing…' : publication.status ? 'Update live page' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
}

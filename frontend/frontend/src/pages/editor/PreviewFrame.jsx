import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GOOGLE_FONTS_URL } from '../../assets/shared/fonts';

const BLANK_DOCUMENT = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

function handleLinkClick(event) {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented) return;

    const href = link.getAttribute('href');
    const doc = link.ownerDocument;

    if (href.startsWith('#')) {
        event.preventDefault();
        const target = href.length > 1 ? doc.getElementById(decodeURIComponent(href.slice(1))) : null;
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            doc.defaultView.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
    }

    if (link.protocol === 'http:' || link.protocol === 'https:') {
        event.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
    }
}

export default function PreviewFrame({ css, children }) {
    const iframeRef = useRef(null);
    const [mountNode, setMountNode] = useState(null);

    function handleLoad() {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;

        let style = doc.head.querySelector('#template-css');
        if (!style) {
            style = doc.createElement('style');
            style.id = 'template-css';
            doc.head.appendChild(style);
        }
        style.textContent = css ?? '';

        if (!doc.head.querySelector('#template-fonts')) {
            const fontLink = doc.createElement('link');
            fontLink.id = 'template-fonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = GOOGLE_FONTS_URL;
            doc.head.appendChild(fontLink);
        }

        doc.body.style.margin = '0';
        doc.removeEventListener('click', handleLinkClick);
        doc.addEventListener('click', handleLinkClick);
        setMountNode(doc.body);
    }

    useEffect(() => {
        if (!mountNode) return;
        const style = mountNode.ownerDocument.head.querySelector('#template-css');
        if (style) style.textContent = css ?? '';
    }, [css, mountNode]);

    return (
        <iframe
            ref={iframeRef}
            title="Page preview"
            srcDoc={BLANK_DOCUMENT}
            onLoad={handleLoad}
            className="ed-iframe"
        >
            {mountNode && createPortal(children, mountNode)}
        </iframe>
    );
}

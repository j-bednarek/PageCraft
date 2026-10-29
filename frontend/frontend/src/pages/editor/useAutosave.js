import { useEffect, useRef, useState } from 'react';
import api from '../../api/client';

const SAVE_DELAY = 1000;

export default function useAutosave(pageId, data) {
    const json = JSON.stringify(data);
    const [savedJson, setSavedJson] = useState(json);
    const [isSaving, setIsSaving] = useState(false);
    const [hasError, setHasError] = useState(false);
    const pendingRef = useRef(null);

    const isDirty = json !== savedJson;

    useEffect(() => {
        if (!isDirty) {
            pendingRef.current = null;
            return;
        }
        pendingRef.current = json;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                await api.patch(`/pages/${pageId}`, JSON.parse(json));
                setSavedJson(json);
                setHasError(false);
            } catch {
                setHasError(true);
            } finally {
                setIsSaving(false);
            }
        }, SAVE_DELAY);

        return () => clearTimeout(timer);
    }, [json, isDirty, pageId]);

    useEffect(() => {
        return () => {
            if (pendingRef.current) {
                api.patch(`/pages/${pageId}`, JSON.parse(pendingRef.current)).catch(() => {});
            }
        };
    }, [pageId]);

    useEffect(() => {
        if (!isDirty) return;

        function warnBeforeLeaving(event) {
            event.preventDefault();
            event.returnValue = '';
        }

        window.addEventListener('beforeunload', warnBeforeLeaving);
        return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
    }, [isDirty]);

    if (hasError) return 'error';
    if (isSaving) return 'saving';
    if (isDirty) return 'unsaved';
    return 'saved';
}

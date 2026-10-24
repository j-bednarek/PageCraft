import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { getTemplate } from '../templates/registry';
import Editor from './Editor';
function EditorMessage({ children }) {
    return (
        <div className="ed-message">
            <p>{children}</p>
            <Link to="/account">Back to my pages</Link>
        </div>
    );
}
export default function EditorPage() {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;
        api.get(`/pages/${id}`)
            .then((response) => { if (!ignore) setPage(response.data.page); })
            .catch((err) => { if (!ignore) setError(getErrorMessage(err)); });
        return () => { ignore = true; };
    }, [id]);

    if (error) return <EditorMessage>{error}</EditorMessage>;
    if (!page) return <EditorMessage>Loading page…</EditorMessage>;

    const template = getTemplate(page.templates.component_key);
    if (!template) return <EditorMessage>This template is no longer available.</EditorMessage>;

    return <Editor key={page.id} page={page} template={template} />;
}
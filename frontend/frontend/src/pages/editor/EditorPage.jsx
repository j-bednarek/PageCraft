import { useParams } from 'react-router-dom';

export default function EditorPage() {
    const { id } = useParams();
    return <p>Edytor strony {id}</p>;
}
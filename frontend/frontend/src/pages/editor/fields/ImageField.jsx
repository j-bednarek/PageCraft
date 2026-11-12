import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../../api/client';
import { getErrorMessage } from '../../../api/errors';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_WIDTH = 1600;

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function prepareImage(file) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const webp = await canvasToBlob(canvas, 'image/webp', 0.82);
    if (webp?.type === 'image/webp') {
        return webp;
    }
    return canvasToBlob(canvas, 'image/jpeg', 0.85);
}

export default function ImageField({ label, value, onChange }) {
    const url = value ?? '';
    const { id: pageId } = useParams();
    const fileInputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');

    async function uploadFile(file) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Choose a JPG, PNG or WebP image.');
            return;
        }
        if (file.size > MAX_INPUT_BYTES) {
            setError('This image is too big. The limit is 15 MB.');
            return;
        }

        setError('');
        setProgress(0);
        try {
            const image = await prepareImage(file);
            const { data } = await api.post('/uploads/presign', { pageId, contentType: image.type });

            await axios.put(data.uploadUrl, image, {
                headers: { 'Content-Type': image.type },
                onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded / (e.total ?? image.size)) * 100));
                }
            });
            onChange(data.publicUrl);
        } catch (err) {
            setError(getErrorMessage(err, 'Upload failed. Try again.'));
        } finally {
            setProgress(null);
        }
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (file) {
            uploadFile(file);
        }
    }

    const isUploading = progress !== null;
return (
    <div className="ed-field">
        <span className="ed-label">{label}</span>
        <div className="ed-image">
            <div className="ed-image-preview">
                {url ? <img src={url} alt="" /> : <i className="fa-regular fa-image" aria-hidden="true"></i>}
            </div>
            <div className="ed-image-body">
    <input
        className="ed-input"
        type="url"
        placeholder="https://… image link"
        value={url}
        onChange={(e) => onChange(e.target.value)}
    />
    <div className="ed-image-actions">
        <button
            type="button"
            className="ed-button-secondary ed-upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
        >
            {isUploading ? `Uploading… ${progress}%` : 'Upload image'}
        </button>
        {url && !isUploading && (
            <button type="button" className="ed-link-button" onClick={() => onChange('')}>
                Remove
            </button>
        )}
    </div>
    <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        hidden
        onChange={handleFileChange}
    />
    {isUploading && (
        <div className="ed-progress" aria-hidden="true">
            <div className="ed-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
    )}
    {error && <p className="ed-field-error" role="alert">{error}</p>}
</div>
        </div>
    </div>
    );
}

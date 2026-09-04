import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../context/AuthContext';

function Field({ id, label, ...inputProps }) {
    return (
        <div className="acc-field">
            <label htmlFor={id}>{label}</label>
            <input id={id} {...inputProps} />
        </div>
    );
}

function FormMessage({ status }) {
    if (!status) return null;
    return (
        <div className={`acc-message acc-message-${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
            {status.text}
        </div>
    );
}

function useSubmit() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const run = async (request, successText) => {
        setStatus(null);
        setIsLoading(true);
        try {
            const response = await request();
            setStatus({ type: 'success', text: successText || response.data.message });
            return response;
        } catch (err) {
            setStatus({ type: 'error', text: getErrorMessage(err) });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, status, setStatus, run };
}

function ProfileForm({ user, onUserUpdated }) {
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const { isLoading, status, run } = useSubmit();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await run(() => api.patch('/account/profile', { name, surname }), 'Profile saved.');
        if (response) onUserUpdated(response.data.user);
    };

    return (
        <form className="acc-card acc-form" onSubmit={handleSubmit}>
            <div className="acc-form-head">
                <h3>Profile</h3>
                <p className="acc-subtle">Your name as it appears in PageCraft.</p>
            </div>
            <div className="acc-row">
                <Field id="acc-name" label="Name" value={name} required maxLength={100}
                    autoComplete="given-name" onChange={(e) => setName(e.target.value)} />
                <Field id="acc-surname" label="Surname" value={surname} required maxLength={100}
                    autoComplete="family-name" onChange={(e) => setSurname(e.target.value)} />
            </div>
            <FormMessage status={status} />
            <div className="acc-form-foot">
                <button type="submit" className="cta-button acc-btn" disabled={isLoading}>
                    {isLoading ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}

function EmailForm({ user, onUserUpdated }) {
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const { isLoading, status, run } = useSubmit();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await run(() => api.patch('/account/email', { newEmail, currentPassword }), 'Email address changed.');
        if (response) {
            onUserUpdated(response.data.user);
            setNewEmail('');
            setCurrentPassword('');
        }
    };

    return (
        <form className="acc-card acc-form" onSubmit={handleSubmit}>
            <div className="acc-form-head">
                <h3>Email address</h3>
                <p className="acc-subtle">You log in with <strong>{user.email}</strong>.</p>
            </div>
            <div className="acc-row">
                <Field id="acc-new-email" label="New email" type="email" required value={newEmail}
                    placeholder="you@example.com" autoComplete="email" onChange={(e) => setNewEmail(e.target.value)} />
                <Field id="acc-email-password" label="Current password" type="password" required value={currentPassword}
                    autoComplete="current-password" onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <FormMessage status={status} />
            <div className="acc-form-foot">
                <button type="submit" className="cta-button acc-btn" disabled={isLoading}>
                    {isLoading ? 'Saving…' : 'Change email'}
                </button>
            </div>
        </form>
    );
}

function PasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { isLoading, status, setStatus, run } = useSubmit();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        const response = await run(() => api.patch('/account/password', { currentPassword, newPassword }));
        if (response) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <form className="acc-card acc-form" onSubmit={handleSubmit}>
            <div className="acc-form-head">
                <h3>Password</h3>
                <p className="acc-subtle">Changing it logs you out on all other devices.</p>
            </div>
            <Field id="acc-current-password" label="Current password" type="password" required
                value={currentPassword} autoComplete="current-password"
                onChange={(e) => setCurrentPassword(e.target.value)} />
            <div className="acc-row">
                <Field id="acc-new-password" label="New password" type="password" required minLength={8} maxLength={72}
                    value={newPassword} autoComplete="new-password" placeholder="At least 8 characters"
                    onChange={(e) => setNewPassword(e.target.value)} />
                <Field id="acc-confirm-password" label="Repeat new password" type="password" required
                    value={confirmPassword} autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <FormMessage status={status} />
            <div className="acc-form-foot">
                <button type="submit" className="cta-button acc-btn" disabled={isLoading}>
                    {isLoading ? 'Saving…' : 'Change password'}
                </button>
            </div>
        </form>
    );
}

function DeleteAccount() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const { isLoading, status, run } = useSubmit();

    const handleDelete = async (e) => {
        e.preventDefault();
        const response = await run(() => api.delete('/account', { data: { password } }));
        if (response) {
            await logout();
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="acc-card acc-danger">
            <div className="acc-form-head">
                <h3>Delete account</h3>
                <p className="acc-subtle">
                    Permanently removes your account, all your pages and your subscription. This cannot be undone.
                </p>
            </div>

            {!isOpen && (
                <div className="acc-form-foot">
                    <button type="button" className="acc-btn acc-btn-danger-outline" onClick={() => setIsOpen(true)}>
                        Delete my account
                    </button>
                </div>
            )}

            {isOpen && (
                <form className="acc-form acc-danger-confirm" onSubmit={handleDelete}>
                    <Field id="acc-delete-password" label="Confirm with your password" type="password" required
                        value={password} autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <label className="acc-check">
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                        I understand that my pages will be deleted permanently.
                    </label>
                    <FormMessage status={status} />
                    <div className="acc-form-foot">
                        <button type="button" className="acc-btn acc-btn-secondary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="acc-btn acc-btn-danger" disabled={!confirmed || isLoading}>
                            {isLoading ? 'Deleting…' : 'Delete permanently'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function SettingsTab({ user, onUserUpdated }) {
    return (
        <div className="acc-stack">
            <div className="acc-section-head">
                <h2>Account settings</h2>
                <p className="acc-subtle">Profile, login details and account removal.</p>
            </div>
            <ProfileForm user={user} onUserUpdated={onUserUpdated} />
            <EmailForm user={user} onUserUpdated={onUserUpdated} />
            <PasswordForm />
            <DeleteAccount />
        </div>
    );
}

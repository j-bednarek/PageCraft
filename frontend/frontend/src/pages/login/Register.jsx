import { useState } from 'react';
import './login.css';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../context/AuthContext';

export default function Register({ onSuccess }) {
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', { name, surname, email, password });
            login(response.data.user);
            onSuccess?.();
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed. Try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-row">
                <div className="auth-field">
                    <label htmlFor="register-name">Name</label>
                    <div className="auth-input-wrap">
                        <i className="fa-regular fa-user"></i>
                        <input
                            id="register-name"
                            type="text"
                            placeholder="Jan"
                            autoComplete="given-name"
                            required
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="auth-field">
                    <label htmlFor="register-surname">Surname</label>
                    <div className="auth-input-wrap">
                        <i className="fa-regular fa-user"></i>
                        <input
                            id="register-surname"
                            type="text"
                            placeholder="Kowalski"
                            autoComplete="family-name"
                            required
                            maxLength={100}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="auth-field">
                <label htmlFor="register-email">Email</label>
                <div className="auth-input-wrap">
                    <i className="fa-regular fa-envelope"></i>
                    <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="auth-field">
                <label htmlFor="register-password">Password</label>
                <div className="auth-input-wrap">
                    <i className="fa-solid fa-lock"></i>
                    <input
                        id="register-password"
                        className="has-eye"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={72}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="auth-eye"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                    </button>
                </div>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="submit" className="cta-button auth-submit" disabled={isLoading}>
                {isLoading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="auth-legal">
                By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </p>
        </form>
    );
}

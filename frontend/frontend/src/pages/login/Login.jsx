import { useState } from 'react';
import './login.css';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../context/AuthContext';

export default function Login({ onSuccess }) {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password, rememberMe });

            login(response.data.user);
            onSuccess?.();
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed. Try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
                <label htmlFor="login-email">Email</label>
                <div className="auth-input-wrap">
                    <i className="fa-regular fa-envelope"></i>
                    <input
                        id="login-email"
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
                <label htmlFor="login-password">Password</label>
                <div className="auth-input-wrap">
                    <i className="fa-solid fa-lock"></i>
                    <input
                        id="login-password"
                        className="has-eye"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        autoComplete="current-password"
                        required
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

            <div className="auth-meta">
                <label className="auth-check">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                </label>
                <a href="#" className="auth-forgot">Forgot password?</a>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="submit" className="cta-button auth-submit" disabled={isLoading}>
                {isLoading ? 'Logging in…' : 'Log in'}
            </button>
        </form>
    );
}

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Login from '../../pages/login/Login';
import Register from '../../pages/login/Register';
import './authModal.css';

export default function AuthModal({ mode, onClose, onSwitch }) {
    const isLogin = mode === 'login';

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

    return createPortal(
        <div className="auth-overlay" onClick={onClose}>
            <div
                className="auth-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" className="auth-close" aria-label="Close" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="auth-brand">
                    <img src="/logo-svg.svg" alt="" />
                    <span>PageCraft</span>
                </div>

                <h2 id="auth-title">
                    {isLogin
                        ? <>Welcome <span className="auth-gradient">back</span></>
                        : <>Create <span className="auth-gradient">account</span></>}
                </h2>
                <p className="auth-subtitle">
                    {isLogin
                        ? 'Log in to keep building your pages.'
                        : 'Free forever. No credit card needed.'}
                </p>

                {isLogin ? <Login onSuccess={onClose} /> : <Register onSuccess={onClose} />}

                <p className="auth-switch">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        className="auth-link"
                        onClick={() => onSwitch(isLogin ? 'register' : 'login')}
                    >
                        {isLogin ? 'Start free' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>,
        document.body
    );
}

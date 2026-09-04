import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../context/AuthContext';
import PagesTab from './PagesTab';
import PlanTab from './PlanTab';
import SettingsTab from './SettingsTab';
import { formatDate, planLabel } from './format';
import './account.css';

const TABS = [
    { key: 'pages', label: 'My pages', icon: 'fa-regular fa-file-lines' },
    { key: 'plan', label: 'Plan & billing', icon: 'fa-regular fa-gem' },
    { key: 'settings', label: 'Account settings', icon: 'fa-solid fa-gear' },
];

export default function Account() {
    const { login } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTab = searchParams.get('tab');
    const activeTab = TABS.some((t) => t.key === requestedTab) ? requestedTab : 'pages';

    const [account, setAccount] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.classList.add('light-page');
        return () => document.body.classList.remove('light-page');
    }, []);

    useEffect(() => {
        let ignore = false;
        api.get('/account')
            .then((response) => { if (!ignore) setAccount(response.data); })
            .catch((err) => { if (!ignore) setError(getErrorMessage(err)); });
        return () => { ignore = true; };
    }, []);

    const handleUserUpdated = (user) => {
        setAccount((prev) => ({ ...prev, user }));
        login({ id: user.id, name: user.name, email: user.email });
    };

    if (error) {
        return (
            <div className="account-page">
                <div className="account-shell">
                    <div className="acc-card acc-message acc-message-error">{error}</div>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="account-page">
                <div className="account-shell">
                    <div className="acc-loading">Loading your account…</div>
                </div>
            </div>
        );
    }

    const { user, plan } = account;

    return (
        <div className="account-page">
            <div className="account-shell">
                <header className="account-header">
                    <div>
                        <span className="acc-eyebrow">Account</span>
                        <h1>
                            Hi, <span className="acc-gradient">{user.name}</span>
                        </h1>
                        <p className="acc-subtle">
                            {user.email} · Member since {formatDate(user.created_at)}
                        </p>
                    </div>
                    <span className={`acc-plan-badge plan-${plan.name}`}>
                        <i className="fa-regular fa-gem"></i> {planLabel(plan.name)} plan
                    </span>
                </header>

                <div className="account-body">
                    <nav className="account-tabs" role="tablist" aria-label="Account sections">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                className={activeTab === tab.key ? 'account-tab active' : 'account-tab'}
                                onClick={() => setSearchParams({ tab: tab.key })}
                            >
                                <i className={tab.icon}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <section className="account-panel" role="tabpanel">
                        {activeTab === 'pages' && <PagesTab usage={account.usage} />}
                        {activeTab === 'plan' && (
                            <PlanTab
                                currentPlan={plan}
                                subscription={account.subscription}
                                usage={account.usage}
                            />
                        )}
                        {activeTab === 'settings' && (
                            <SettingsTab user={user} onUserUpdated={handleUserUpdated} />
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

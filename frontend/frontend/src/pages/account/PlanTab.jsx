import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getErrorMessage } from '../../api/errors';
import { formatDate, formatPrice, planLabel } from './format';

export default function PlanTab({ currentPlan, subscription, usage }) {
    const [plans, setPlans] = useState(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let ignore = false;
        api.get('/plans')
            .then((response) => { if (!ignore) setPlans(response.data); })
            .catch((err) => { if (!ignore) setError(getErrorMessage(err)); });
        return () => { ignore = true; };
    }, []);

    const handleChoose = (plan) => {
        setNotice(`Payments are coming soon. You'll be able to switch to ${planLabel(plan.name)} here.`);
    };

    return (
        <div className="acc-stack">
            <div className="acc-section-head">
                <h2>Plan &amp; billing</h2>
                <p className="acc-subtle">You pay for the number of published pages, not for features.</p>
            </div>

            <div className="acc-card acc-current-plan">
                <div>
                    <span className="acc-label">Current plan</span>
                    <div className="acc-current-plan-name">
                        <span className={`acc-plan-dot plan-${currentPlan.name}`}></span>
                        {planLabel(currentPlan.name)}
                    </div>
                    <p className="acc-subtle">
                        {currentPlan.max_active_pages === 0
                            ? 'Drafts only - publishing needs a paid plan.'
                            : `Up to ${currentPlan.max_active_pages} published ${currentPlan.max_active_pages === 1 ? 'page' : 'pages'}. You use ${usage.published}.`}
                    </p>
                </div>
                <div className="acc-current-plan-price">
                    <strong>{currentPlan.price_cents === 0 ? 'Free' : formatPrice(currentPlan.price_cents)}</strong>
                    {currentPlan.price_cents > 0 && <span>per month</span>}
                    {subscription?.current_period_end && (
                        <span className="acc-subtle">
                            {subscription.status === 'canceled' ? 'Ends' : 'Renews'} on {formatDate(subscription.current_period_end)}
                        </span>
                    )}
                </div>
            </div>

            {error && <div className="acc-message acc-message-error">{error}</div>}
            {notice && <div className="acc-message acc-message-info">{notice}</div>}

            {plans && plans.length === 0 && (
                <div className="acc-message acc-message-info">
                    No plans in the database yet. Add rows to the <code>plans</code> table.
                </div>
            )}

            {plans && plans.length > 0 && (
                <div className="acc-plan-grid">
                    {plans.map((plan) => {
                        const isCurrent = plan.name === currentPlan.name;
                        const isUpgrade = plan.price_cents > currentPlan.price_cents;
                        return (
                            <div
                                key={plan.id}
                                className={`acc-card acc-plan plan-${plan.name}${isCurrent ? ' is-current' : ''}`}
                            >
                                <div className="acc-plan-top">
                                    <span className="acc-plan-name">{planLabel(plan.name)}</span>
                                    {isCurrent && <span className="acc-pill acc-pill-live">Current</span>}
                                </div>
                                <div className="acc-plan-price">
                                    <strong>{formatPrice(plan.price_cents)}</strong>
                                    {plan.price_cents > 0 && <span>/ month</span>}
                                </div>
                                <p className="acc-subtle">
                                    {plan.max_active_pages === 0
                                        ? 'Unlimited editing, up to 5 drafts'
                                        : `${plan.max_active_pages} published ${plan.max_active_pages === 1 ? 'page' : 'pages'} + 5 drafts`}
                                </p>
                                <button
                                    type="button"
                                    className={isUpgrade && !isCurrent ? 'cta-button acc-btn' : 'acc-btn acc-btn-secondary'}
                                    disabled={isCurrent}
                                    onClick={() => handleChoose(plan)}
                                >
                                    {isCurrent ? 'Current plan' : isUpgrade ? 'Upgrade' : 'Downgrade'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const { prisma } = require('../db');

const DRAFT_LIMIT = 5;

const FREE_PLAN_FALLBACK = { id: null, name: 'free', price_cents: 0, max_active_pages: 0 };

function publicPlan(plan) {
    return {
        id: plan.id,
        name: plan.name,
        price_cents: plan.price_cents,
        max_active_pages: plan.max_active_pages
    };
}

async function getCurrentPlan(userId) {
    const subscription = await prisma.subscriptions.findFirst({
        where: {
            user_id: userId,
            OR: [
                { status: 'active' },
                { status: 'canceled', current_period_end: { gt: new Date() } }
            ]
        },
        orderBy: { created_at: 'desc' },
        include: { plans: true }
    });

    if (subscription) {
        return {
            plan: subscription.plans,
            subscription: {
                status: subscription.status,
                current_period_end: subscription.current_period_end
            }
        };
    }

    const freePlan = await prisma.plans.findUnique({ where: { name: 'free' } });
    return { plan: freePlan || FREE_PLAN_FALLBACK, subscription: null };
}

module.exports = { DRAFT_LIMIT, publicPlan, getCurrentPlan };

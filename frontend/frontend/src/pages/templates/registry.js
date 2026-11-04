import portfolioMinimal from './portfolioMinimal/definition';
import localBusiness from './localBusiness/definition';
import bistro from './bistro/definition';
import eventInvite from './eventInvite/definition';
import resumeClassic from './resumeClassic/definition';

const templates = {
    [portfolioMinimal.key]: portfolioMinimal,
    [localBusiness.key]: localBusiness,
    [bistro.key]: bistro,
    [eventInvite.key]: eventInvite,
    [resumeClassic.key]: resumeClassic,
};

export function getTemplate(key) {
    return templates[key] ?? null;
}

export function getAllTemplates() {
    return Object.values(templates);
}

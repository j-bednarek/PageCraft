import portfolioMinimal from './portfolioMinimal/definition';
import localBusiness from './localBusiness/definition';
import bistro from './bistro/definition';
import eventInvite from './eventInvite/definition';
import resumeClassic from './resumeClassic/definition';
import { SEO_DEFAULTS, SEO_FIELDS } from './seo';

function withSeo(definition) {
    return {
        ...definition,
        defaultContent: { ...definition.defaultContent, seo: SEO_DEFAULTS },
        fields: [...definition.fields, ...SEO_FIELDS],
    };
}
const templates = {
    [portfolioMinimal.key]: withSeo(portfolioMinimal),
    [localBusiness.key]: withSeo(localBusiness),
    [bistro.key]: withSeo(bistro),
    [eventInvite.key]: withSeo(eventInvite),
    [resumeClassic.key]: withSeo(resumeClassic),
};

export function getTemplate(key) {
    return templates[key] ?? null;
}

export function getAllTemplates() {
    return Object.values(templates);
}

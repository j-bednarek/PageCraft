import portfolioMinimal from './portfolioMinimal/definition';

const templates = {
    [portfolioMinimal.key]: portfolioMinimal,
};

export function getTemplate(key) {
    return templates[key] ?? null;
}

export function getAllTemplates() {
    return Object.values(templates);
}

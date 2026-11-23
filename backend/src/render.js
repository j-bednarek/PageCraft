const path = require('path');

const BUNDLE_PATH = path.join(__dirname, '..', 'ssr', 'renderPage.cjs');

function renderPublishedPage({ templateKey, content, title }) {
    const { renderPage } = require(BUNDLE_PATH);
    return renderPage({ templateKey, content, title });
}

module.exports = { renderPublishedPage };
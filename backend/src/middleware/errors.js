function notFound(req, res) {
    res.status(404).json({ error: 'Nie znaleziono.' });
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Przesłane dane są za duże.' });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Nieprawidłowy format danych.' });
    }
    console.error('Nieobsłużony błąd:', err);
    res.status(500).json({ error: 'Wystąpił błąd serwera.' });
}

module.exports = { notFound, errorHandler };

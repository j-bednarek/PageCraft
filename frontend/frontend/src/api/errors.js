export function getErrorMessage(err, fallback = 'Something went wrong. Try again.') {
    if (err.response) {
        return err.response.data?.error || fallback;
    }
    if (err.request) {
        return 'No response from the server. Check your connection.';
    }
    return fallback;
}

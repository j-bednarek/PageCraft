const MAX_ID = 2147483647;
function parseId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) {
        return null;
    }
    return id;
}
module.exports = { parseId };
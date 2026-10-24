export function getIn(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setIn(obj, keys, value) {
    if (keys.length === 0) {
        return value;
    }

    const [key, ...rest] = keys;

    const copy = Array.isArray(obj) ? [...obj] : { ...obj };
    copy[key] = setIn(obj?.[key], rest, value);
    return copy;
}

export function contentReducer(state, action) {
    switch (action.type) {
        case 'set':
            return setIn(state, action.path.split('.'), action.value);

        case 'reset':
            return action.content;

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function withDefaults(defaults, saved) {
    if(saved === undefined) {
        return defaults;
    }
    if (!isPlainObject(defaults) || !isPlainObject(saved)) {
        return saved;
    }

      const result = { ...defaults };
  for (const key of Object.keys(saved)) {
      result[key] =  withDefaults(defaults[key], saved[key]);
  }
  return result;
}
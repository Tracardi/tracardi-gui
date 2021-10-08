export function isString(value) {
    return typeof value === 'string' || value instanceof String
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

export function isString(value) {
    return typeof value === 'string' || value instanceof String
}

export function isObject (a) {
    return (!!a) && (a.constructor === Object);
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

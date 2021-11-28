export function isString(value) {
    return typeof value === 'string' || value instanceof String
}

export function isObject (a) {
    return (!!a) && (a.constructor === Object);
}

export function isEmptyObject(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}

export function isEmptyObjectOrNull(obj) {
    return !obj || obj === null || (isObject(obj) && Object.keys(obj).length === 0);
}
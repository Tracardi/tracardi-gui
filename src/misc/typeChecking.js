export function isString(value) {
    return typeof value === 'string' || value instanceof String
}

export function isEmptyStringOrNull(value) {
    return !value?.length;
}

export function isObject (a) {
    return (!!a) && (a.constructor === Object);
}

export function isEmptyObject(obj) {
    if (!obj) {
        return true
    }
    return (isObject(obj) && Object.keys(obj).length === 0);
}

export function isEmptyObjectOrNull(obj) {
    return !obj || obj === null || (isObject(obj) && Object.keys(obj).length === 0);
}

export function isInt(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
}


export function isNotEmptyArray(value) {
    return Array.isArray(value) && value.length > 0
}

export function startsWith(text, listOfTexts) {
    for(const item of listOfTexts) {
        if(text.startsWith(item)) {
            return true
        }
    }

    return false
}
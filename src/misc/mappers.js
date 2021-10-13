export function objectMap(obj, func) {
    return Object.entries(obj).map(([k, v]) => func(k, v));
}

export function objectFilter(raw, allowed) {
    return Object.keys(raw)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {});
}
import {isObject, isString} from "./typeChecking";

export function objectMap(obj, func) {
    return Object.entries(obj).map(([k, v]) => func(k, v));
}

export function objectMapEntries(node, fn) {
    const newNode = {};
    Object.entries(node).forEach(([key, val]) => (newNode[key] = fn(key, val)));
    return newNode;
}

export function objectFilter(raw, allowed) {
    return Object.keys(raw)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {});
}

export function searchRecursivelyInValues (path, obj) {
    if (Array.isArray(path) && path.length > 1) {
        const key = path.shift();
        if (isObject(obj) && key in obj) {
            return searchRecursivelyInValues(path, obj[key]);
        } else return null;

    } else if (Array.isArray(path) && path.length === 1) {
        const key = path.shift();
        if (isObject(obj) && key in obj) {
            return obj[key];
        } else return null;

    } else return null;
}

export function changeReferences(obj, spec=null) {
    if (isObject(obj) && isObject(spec)) {
        for (let keys in obj) {
            if (isObject(obj[keys])) {
                changeReferences(obj[keys], spec)
            } else {
                let value = obj[keys]
                if (isString(value) && value.startsWith('$')) {
                    const refValue = searchRecursivelyInValues(value.substring(1).split('.'), spec)
                    if(refValue) {
                        obj[keys] = refValue;
                    } else {
                        obj[keys] = `Reference error. Value not found ${value}`;
                    }
                }
            }
        }
    }
    return obj;
}
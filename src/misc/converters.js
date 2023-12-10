import {isObject} from "./typeChecking";
import {objectMap} from "./mappers";

export function convertNamedEntityToIdName(entities) {
    const obj = {};

    entities.forEach(item => {
        const { id, name } = item;
        obj[id] = name;
    });

    return obj;
}


export function convertResponseToAutoCompleteOptions(response) {
    if (Array.isArray(response.data?.result)) {
        return response.data?.result.map((key) => {
            if (isObject(key)) {
                return key
            }
            return {name: key, id: key}
        });
    } else if (isObject(response.data?.result)) {
        return objectMap(response.data?.result, (key, value) => {
            return {name: value, id: key}
        })
    }
    return []
}

export function round(num, places) {
    return +(Math.round(num + "e+" + places) + "e-" + places);
}

export function abbreviateNumber(value) {
    let newValue = typeof value === "number" ? value : 0;
    if (value >= 1000) {
        let suffixes = ["", "k", "m", "b", "t"];
        let suffixNum = Math.floor(("" + value).length / 3);
        let shortValue = '';
        for (let precision = 3; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 4) {
                break;
            }
        }
        if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(2);
        newValue = shortValue + suffixes[suffixNum];
        return newValue
    }
    return round(newValue, 3);
}

function ensureUTC(dateString) {
    if (!dateString.endsWith('Z') && !dateString.match(/[\+\-]\d{2}:\d{2}$/)) {
        dateString += 'Z';
    }
    return dateString;
}

export function makeUtcStringTzAware(utcString) {
    if(utcString === null) {
        return null
    }
    const date = new Date(ensureUTC(utcString))
    return date.toLocaleString();
}

export function formatDate(utcString) {
    if(utcString === null) {
        return null
    }
    let date = new Date(utcString);
    return date.toLocaleString();
}

export function makeTzAwareDate(utcString) {
    if(!utcString) {
        return null
    }
    return new Date(ensureUTC(utcString))
}

export function formatDateIso(utcString) {
    if(!utcString) {
        return null
    }
    let date = new Date(utcString);
    return date.toISOString();
}
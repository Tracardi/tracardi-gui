export function getValueIfExists(obj, property, defaultValue = undefined) {
    if (obj && obj.hasOwnProperty(property)) {
        return obj[property];
    }
    return defaultValue;
}
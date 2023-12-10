function intersect(a, b) {
    let setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}

export default function hasRoles(userRoles, requriedRoles) {

    if (requriedRoles === null) {
        return true
    }

    if (intersect(userRoles, requriedRoles).length > 0) {
        return true
    }

    return false
}
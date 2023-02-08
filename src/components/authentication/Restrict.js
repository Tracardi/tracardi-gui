import {getRoles} from "./login";

export function Restrict({roles, children}) {

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    const isAllowed = () => {
        if (intersect(getRoles(), roles).length > 0) {
            return true
        }
        return false
    }

    if (isAllowed()) {
        return children
    }
    return ""
}
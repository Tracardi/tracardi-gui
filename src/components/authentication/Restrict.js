import {useContext} from "react";
import {KeyCloakContext} from "../context/KeyCloakContext";

export function Restrict({roles, children}) {

    const authContext = useContext(KeyCloakContext)

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    const isAllowed = () => {
        if (intersect(authContext?.state?.roles, roles).length > 0) {
            return true
        }
        return false
    }

    if (isAllowed()) {
        return children
    }
    return ""
}
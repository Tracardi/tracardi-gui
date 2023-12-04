import {useContext} from "react";
import {KeyCloakContext} from "../context/KeyCloakContext";
import hasRoles from "./hasRoles";

export function Restrict({roles, children}) {

    const authContext = useContext(KeyCloakContext)

    if (hasRoles(authContext?.state?.roles, roles)) {
        return children
    }
    return ""
}
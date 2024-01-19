import {useContext} from "react";
import {LocalDataContext} from "../pages/DataAnalytics";
import {DataContext} from "../AppBox";
import Keycloak from "keycloak-js";
import envs from "../../envs";

export function RestrictToContext({children, production=false}) {
    const globalContext = useContext(DataContext)

    if(globalContext === production) {
        return children
    }

    return ""
}

export function RestrictToMode({children, mode = 'os'}) {
    if (mode === 'os' && envs.commercial === false) {
        return children
    } else if (mode === 'commercial' && envs.commercial === true) {
        return children
    }

    return ""
}
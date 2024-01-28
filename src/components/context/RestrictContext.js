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

export function RestrictToMode({children, mode = 'no-deployment', forceMode}) {

    const currentMode = forceMode || envs.withDeployment

    if (currentMode === mode) {
        return children
    }

    return ""
}


export function DisplayOnlyOnTestContext({children}) {
    const productionContext = useContext(DataContext)

    if(envs.freezeProduction !== true) {
        return children
    }

    if (productionContext === false) {
        return children
    }

    return ""
}


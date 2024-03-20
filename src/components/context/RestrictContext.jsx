import {useContext} from "react";
import {DataContext} from "../AppBox";
import envs from "../../envs";

export function RestrictToContext({children, production = false}) {
    const globalContext = useContext(DataContext)

    if (globalContext === production) {
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


export function DisplayOnlyIfUpdatesAllowedOnProduction({children}) {
    const productionContext = useContext(DataContext)

    if (envs.allowUpdatesOnProduction !== true && productionContext === false) {
        return children
    }

    return ""
}


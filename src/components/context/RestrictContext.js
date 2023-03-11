import {useContext} from "react";
import {LocalDataContext} from "../pages/DataAnalytics";

export function RestrictToProductionContext({children}) {
    const localContext = useContext(LocalDataContext)

    if(localContext === true) {
        return children
    }

    return ""
}

export function RestrictToLocalStagingContext({children}) {
    const localContext = useContext(LocalDataContext)

    if(localContext !== true) {
        return children
    }

    return ""
}
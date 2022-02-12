import {isObject} from "./typeChecking";
import {objectMap} from "./mappers";

export function convertResponseToAutoCompleteOptions(response) {
    if (Array.isArray(response.data?.result)) {
        return response.data?.result.map((key) => {
            if(isObject(key)) {
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

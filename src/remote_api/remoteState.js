import {useQuery} from "react-query";
import {useRequest} from "./requestClient";

export const useFetch = (name, endpoint, resolveFn, options={}) => {

    const {request} = useRequest()

    if(endpoint instanceof Function) {
        endpoint = endpoint()
    }

    const closure = () => request(endpoint, true).then(data => {return resolveFn(data)})

    return useQuery(name, closure, options)
}

export const getFetchError = (e) => {
    return `Status: ${e?.status}, Message: ${e?.statusText}, Details: ${e?.data?.detail}`
}
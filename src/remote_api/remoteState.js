import {useQuery} from "react-query";
import {useContext} from "react";
import {LocalDataContext} from "../components/pages/DataAnalytics";
import {publish} from "../misc/events";
import {useRequest} from "./requestClient";

export const useFetch = (name, endpoint, resolveFn, options={}) => {

    const {request} = useRequest()

    publish('connect');

    const localContext = useContext(LocalDataContext)

    if(endpoint instanceof Function) {
        endpoint = endpoint()
    }

    if(localContext) {
        endpoint = {...endpoint, headers: {"x-context": "production"}}
    }

    const closure = () => request(endpoint).then(data => {return resolveFn(data)})

    return useQuery(name, closure, options)
}

export const getFetchError = (e) => {
    return `Status: ${e?.status}, Message: ${e?.statusText}, Details: ${e?.data?.detail}`
}
import axios from 'axios'
import {getToken, logout} from "../components/authentication/login";
import storageValue from "../misc/localStorageDriver";
import {isObject} from "../misc/typeChecking";
import {objectMap} from "../misc/mappers";

export const apiUrlStorage = () => {
    return new storageValue('tracardi-api-url')
}

export const hasApiUrlConfig = () => {
    return apiUrlStorage().read() !== null
}

export const resetApiUrlConfig = () => {
    return apiUrlStorage().remove()
}

export const getApiUrl = () => {
    return apiUrlStorage().read()
}

const authToken = () => {
    let token = getToken();
    return 'Bearer ' + (token == null ? 'None' : token)
}

export const asyncRemote = async (config) => {

    if(!config?.baseURL) {
        const apiUrl = getApiUrl();
        config = {
            ...config,
            baseURL: apiUrl
        }
    }

    config.headers = {
        ...config?.headers,
        'Authorization': authToken()
    }

    config.timeout = 1000 * 60

    return axios(config)
}


export const getError = (e) => {

    if (e?.response) {

        if (e.request && e.request.status === 401) {
            logout();
        }

        if( Array.isArray(e.response?.data?.detail)) {
            return e.response?.data?.detail;
        } else if (e.response?.data?.detail && typeof e.response?.data?.detail === 'string') {
            return [{msg:e.response.data.detail, type: "Exception", response: e.response}];
        } else if (e.response?.data && isObject(e.response?.data)) {
            const message = objectMap(e.response?.data, (k, v) => {
                return `${k}: ${v} `
            })
            return [{msg:message, type: "Exception", response: e.response}];
        } else {
            return [{msg:e.message, type: "Exception", response: e.response}];
        }

    } else {
        return [{msg:e.message, type: "Exception"}];
    }
}

export const covertErrorIntoObject = (errors) => {
    let obj = {}
    if(Array.isArray(errors)) {
        errors.map((error) => {
            if(error?.loc) {
                const path = error.loc.slice(1)
                obj[path.join(".")] = error.msg
            }
        })
    }
    return obj;
}

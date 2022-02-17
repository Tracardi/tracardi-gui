import axios from 'axios'
import {getToken, logout} from "../components/authentication/login";
import storageValue from "../misc/localStorageDriver";

export const apiUrl = () => {
    const api_url = new storageValue('tracardi-api-url').read(window._env_.API_URL)
    return api_url ? api_url : window._env_.API_URL;
}

const authToken = () => {
    let token = getToken();
    return 'Bearer ' + (token == null ? 'None' : token)
}

export const api = (headers) => {
    headers = {
        ...headers,
        'Authorization': authToken()
    }

    return axios.create({
        baseURL: apiUrl(),
        headers
    })
}

export const asyncRemote = async (config) => {
    if(!config?.baseURL) {
        config = {
            ...config,
            baseURL: apiUrl()
        }
    }

    config.headers = {
        ...config.headers,
        'Authorization': authToken()
    }

    config.timeout = 1000 * 15

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

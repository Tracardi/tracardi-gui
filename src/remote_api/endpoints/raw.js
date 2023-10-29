import {getApiUrl} from "../entrypoint";
import axios from "axios";
import {getToken} from "../../components/authentication/login";
import {getDataContextHeader} from "../../config";


const authToken = (token = null) => {
    token = token || getToken();
    return 'Bearer ' + (token == null ? 'None' : token)
}

export const request = async (config, token = null) => {

    if (!config?.baseURL) {
        const apiUrl = getApiUrl();
        config = {
            ...config,
            baseURL: apiUrl
        }
    }

    config.headers = {
        ...config?.headers,
        'Authorization': token === null ? authToken() : authToken(token)
    }

    if (!('x-context' in config.headers)) {
        config.headers = {
            ...config?.headers,
            'x-context': getDataContextHeader()
        }
    }

    config.timeout = 1000 * 60

    // Success handler
    const onSuccess = (response) => {
        return response?.data
    }

    // Error handler
    const onError = (e) => {
        if (e?.response?.status === 401) {
            window.location.replace("/logout");
        }
        return Promise.reject(e?.response ? e.response : {status: e.status, data: {detail: e.toString()}})
    }

    return axios(config).then(onSuccess).catch(onError)
}


export default class RemoteService {
    static fetch(config) {
        return request(config)
    }
}
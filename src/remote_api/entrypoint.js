import axios from 'axios'
import {getToken} from "../components/authentication/login";
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

export const remote = (config) => {
    config = {
        ...config,
        baseURL: apiUrl()
    }
    config.headers = {
        ...config.headers,
        'Authorization': authToken()
    }
    return axios(config)
}

export const asyncRemote = async (config) => {
    config = {
        ...config,
        baseURL: apiUrl()
    }
    config.headers = {
        ...config.headers,
        'Authorization': authToken()
    }

    return axios(config)
}

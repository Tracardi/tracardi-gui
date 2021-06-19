import axios from 'axios'
import {getToken} from "../components/authentication/login";

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
        baseURL: window._env_.API_URL,
        headers
    })
}

export const remote = (config) => {
    config = {
        ...config,
        baseURL: window._env_.API_URL
    }
    config.headers = {
        ...config.headers,
        'Authorization': authToken()
    }
    return axios(config)
}

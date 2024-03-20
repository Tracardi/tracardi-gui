import {getApiUrl} from "./entrypoint";
import axios from "axios";
import {getDataContextHeader} from "../config";
import {useContext} from "react";
import {KeyCloakContext} from "../components/context/KeyCloakContext";
import {publish} from "../misc/events";

export const useRequest = () => {

    const authContext = useContext(KeyCloakContext)

    return {
        request: async (config, returnDataOnly=false, token = null) => {

            if (!config?.baseURL) {
                const apiUrl = getApiUrl();
                config = {
                    ...config,
                    baseURL: apiUrl
                }
            }

            token = token || authContext?.state?.token;

            config.headers ={
                ...config.headers,
                'x-client': 'tracardi-gui'
            }

            if(token) {
                config.headers = {
                    ...config?.headers,
                    'Authorization': 'Bearer ' + token
                }
            }


            if (!('x-context' in config.headers)) {
                config.headers = {
                    ...config?.headers,
                    'x-context': getDataContextHeader()
                }
            }

            config.timeout = 1000 * 60

            publish('connect');

            // Success handler
            const onSuccess = (response) => {
                if(returnDataOnly === true) {
                    return response?.data
                }
                return response
            }

            // Error handler
            const onError = (e) => {
                if (e?.response?.status === 401) {
                    authContext.logout()
                }
                return Promise.reject(e?.response
                    ? {status: e.response.status, response: e.response}
                    : {status: e.status, data: {detail: e.toString()}})
            }

            return axios(config).then(onSuccess).catch(onError)
        }
    }
}

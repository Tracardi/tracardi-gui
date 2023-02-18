import {getError, asyncRemote} from "./entrypoint";

export const request = ({url, headers, method, data}, setLoading, setError, setReady, setDefaultValues=true) => {

    if(typeof headers == "undefined") {
        headers = {"Content-Type":'application/json'};
    }

    if(typeof method == "undefined") {
        method = "get";
    }

    try {
        asyncRemote({
            url,
            method,
            headers,
            data
        }).then(response => {
            setLoading(false);
            setError(false);
            setReady({data: response.data, error: false});
        }).catch((e) => {
            setLoading(false);
            setReady(false);
            setError(getError(e))
        });
    } catch (e) {
        setReady(false);
        setLoading(false);
        setError([{msg:e.message, type: "Exception"}]);
    }
};
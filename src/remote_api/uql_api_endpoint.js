import {getError, asyncRemote} from "./entrypoint";

export const request = ({url, header, method, data}, setLoading, setError, setReady, setDefaultValues=true) => {

    if(typeof header == "undefined") {
        header = {"Content-Type":'application/json'};
    }

    if(typeof method == "undefined") {
        method = "get";
    }

    try {
        asyncRemote({
            url,
            method,
            header,
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
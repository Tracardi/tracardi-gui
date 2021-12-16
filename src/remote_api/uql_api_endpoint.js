import {api, getError, asyncRemote} from "./entrypoint";

export const fetchData = (uqlStatement, url, setLoading, setError, setReady, setDefaultValues = true) => {
    if (setDefaultValues) {
        setError(false);
        setReady(false);
        setLoading(true);
    }
    try {
        api({"Content-type": "text/plain"})
            .post(url, uqlStatement)
            .then(response => {
                setLoading(false);
                setReady({"data": response.data});
            })
            .catch((e) => {
                setLoading(false);
                if (typeof (e.response) != "undefined") {
                    setError(e.response.data.detail);
                } else {
                    setError(e.message);
                }
            });
    } catch (e) {
        setError(e.message);
    }
};

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
import {api, remote} from "./entrypoint";
import {logout} from "../components/authentication/login";

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

export const putData = (uqlStatement, url, setLoading, setError, setReady, setDefaultValues = true) => {
    if (setDefaultValues) {
        setError(false);
        setReady(false);
        setLoading(true);
    }
    try {
        api({"Content-type": "application/json"})
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

export const getData = (url, setLoading, setError, setReady) => {
    setError(false);
    setReady(false);
    setLoading(true);
    try {
        api({"Content-type": "application/json"})
            .get(url)
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

export const deleteData = (url, setLoading, setError, setReady) => {
    setError(false);
    setReady(false);
    setLoading(true);
    try {
        api({"Content-type": "application/json"})
            .delete(url)
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

export const createRule = (params, loading, ready, error) => {
    try {
        loading();
        const path = '/rule';
        api({"Content-type": "application/json"})
            .post(path, params)
            .then(response => {
                ready({"data": response.data});
            })
            .catch((e) => {
                error(e);
            });
    } catch (e) {
        error(e);
    }
};

export const createSegment = (params, loading, ready, error) => {
    try {
        loading();
        const path = '/segment';
        api({"Content-type": "application/json"})
            .post(path, params)
            .then(response => {
                ready({"data": response.data});
            })
            .catch((e) => {
                error(e);
            });
    } catch (e) {
        error(e);
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
        remote({
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
            if (e.response) {
                if( typeof e.response?.data?.detail === 'object'
                    && Array.isArray(e.response?.data?.detail)) {
                        setError(e.response.data.detail);
                } else if (e.response?.data.detail && typeof e.response?.data?.detail === 'string') {
                    setError([{msg:e.response.data.detail, type: "Exception", response: e.response}]);
                } else {
                    setError([{msg:e.message, type: "Exception", response: e.response}]);
                }

                if (e.request && e.request.status === 401) {
                    logout();
                }

            } else {
                setError([{msg:e.message, type: "Exception"}]);
            }
        });
    } catch (e) {
        setReady(false);
        setLoading(false);
        setError([{msg:e.message, type: "Exception"}]);
    }
};
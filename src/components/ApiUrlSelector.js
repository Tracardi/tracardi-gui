import React, {useEffect, useState} from "react";
import {apiUrlStorage, asyncRemote, getError} from "../remote_api/entrypoint";
import storageValue from "../misc/localStorageDriver";
import {BsHddNetwork} from "react-icons/bs";
import TuiApiUrlInput from "./elements/tui/TuiApiUrlInput";
import Button from "./elements/forms/Button";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import Grid from "@mui/material/Grid";
import PaperBox from "./elements/misc/PaperBox";
import {connect} from "react-redux";
import {showAlert} from "../redux/reducers/alertSlice";

const ApiUrlSelector = ({children, showAlert}) => {

    const [endpoint, setEndpoint] = useState(apiUrlStorage().read());
    const [progress, setProgress] = useState(false);
    const [failed, setFailed] = useState(false);
    const [isEndpointValid, setIsEndpointValid] = useState(null);
    const [apiLocation, setApiLocation] = useState(apiUrlStorage().read());
    const [isEndpointReachable, setIsEndpointReachable] = useState(true);

    const isValidUrl = (string) => {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    useEffect(() => {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("api_url")) {
            let apiUrl = urlParams.get("api_url");
            setApiLocation(apiUrl);
        }
    }, [])

    useEffect(() => {
        let isSubscribed = true

        if (apiLocation === null || !isValidUrl(apiLocation)) {
            setIsEndpointReachable(true); // Nothing to reach
            setIsEndpointValid(false);
        } else {
            setProgress(true);
            setFailed(false);

            asyncRemote({
                url: "/healthcheck",
                baseURL: apiLocation
            }).then(
                (response) => {
                    if (response && isSubscribed) {

                        apiUrlStorage().save(apiLocation)

                        let historicalEndpoints = new storageValue('tracardi-api-urls').read([]);
                        if (!historicalEndpoints.includes(apiLocation)) {
                            if (apiLocation !== null) {
                                historicalEndpoints.push(apiLocation);
                                new storageValue('tracardi-api-urls').save(historicalEndpoints, []);
                            }
                        }
                        setIsEndpointReachable(true);
                        setIsEndpointValid(true);
                    } else {
                        setIsEndpointReachable(false);
                        setIsEndpointValid(false);
                    }
                }
            ).catch((e) => {
                if (isSubscribed) {
                    setFailed(true);
                    setIsEndpointReachable(false);
                    setIsEndpointValid(false);
                    const errors = getError(e)
                    console.log(errors)
                    showAlert({type: "error", message: errors[0].msg, hideAfter: 4000})
                }

            }).finally(() => {
                if (isSubscribed) setProgress(false)
            })
        }

        return () => isSubscribed = false
    }, [apiLocation]);

    if (isEndpointValid === null) {
        return <CenteredCircularProgress/>
    }

    if (isEndpointValid === false) {
        return <PaperBox>
                <BsHddNetwork size={50} style={{color: "#666"}}/>
                <h1 style={{fontWeight: 300}}>Select TRACARDI server</h1>
                <p>Type or select TRACARDI API Url.</p>
                <Grid container display="flex" justifyContent="center">
                    <Grid item xs={8}>
                        <div style={{
                            display: "flex",
                            alignItems: "flex-end",
                            marginBottom: (!isEndpointValid || !isEndpointReachable) && apiLocation && !progress ? 0 : 22
                        }}>
                            <TuiApiUrlInput
                                label="API Endpoint URL"
                                value={apiLocation || apiUrlStorage().read() || ""}
                                options={new storageValue('tracardi-api-urls').read([])}
                                onChange={(v) => setEndpoint(v)}
                                errorMessage={progress ? null : apiLocation && (!isEndpointReachable ? "Given API URL is not reachable" : isEndpointValid ? null : "Given API URL is invalid")}
                            />
                            <Button label="Select"
                                    onClick={() => setApiLocation(endpoint)}
                                    progress={progress}
                                    error={failed}
                                    style={{
                                        height: 38,
                                        marginBottom: (!isEndpointValid || !isEndpointReachable) && apiLocation && !progress ? 31 : 9
                                    }}
                            />
                        </div>

                    </Grid>
                </Grid>
            </PaperBox>
    }

    return children;
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};

export default connect(
    mapProps,
    {showAlert}
)(ApiUrlSelector)
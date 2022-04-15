import React, {useEffect, useState} from "react";
import {apiUrlStorage, asyncRemote} from "../remote_api/entrypoint";
import storageValue from "../misc/localStorageDriver";
import {BsHddNetwork} from "react-icons/bs";
import EndpointInput from "./authentication/EndpointInput";
import Button from "./elements/forms/Button";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";

const ApiUrlSelector = ({children}) => {

    const [endpoint, setEndpoint] = useState(apiUrlStorage().read());
    const [progress, setProgress] = useState(false);
    const [failed, setFailed] = useState(false);
    const [isEndpointValid, setIsEndpointValid] = useState(null);
    const [apiLocation, setApiLocation] = useState(apiUrlStorage().read());

    useEffect(() => {
        setProgress(true);
        setFailed(false);
        let isSubscribed = true
        asyncRemote({
            url: "/healthcheck",
            baseURL: apiLocation
        }).then(
            (response) => {
                if (response && isSubscribed) {

                    apiUrlStorage().save(apiLocation)

                    let historicalEndpoints = new storageValue('tracardi-api-urls').read([]);
                    if (historicalEndpoints === null) {
                        historicalEndpoints = [];
                    }
                    if (!historicalEndpoints.includes(apiLocation)) {
                        if (apiLocation !== null) {
                            historicalEndpoints.push(apiLocation);
                            new storageValue('tracardi-api-urls').save(historicalEndpoints, []);
                        }
                    }
                    setIsEndpointValid(true)
                } else {
                    setIsEndpointValid(false)
                }
            }
        ).catch((e) => {
            if(isSubscribed) {
                setFailed(true)
                setIsEndpointValid(false)
            }

        }).finally(() => {
            if(isSubscribed) setProgress(false)
        })

        return () => isSubscribed = false
    }, [apiLocation]);

    if (isEndpointValid === null) {
        return <CenteredCircularProgress/>
    }

    if (isEndpointValid === false) {
        return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 50,
                width: "50%",
                backgroundColor: "white",
                borderRadius: 10
            }}>
                <BsHddNetwork size={50} style={{color: "#666"}}/>
                <h1 style={{fontWeight: 300}}>Select TRACARDI server</h1>
                <p>Type or select TRACARDI API Url.</p>
                <div style={{width: 400, display: "flex", alignItems: "flex-end"}}>
                    <EndpointInput options={new storageValue('tracardi-api-urls').read() || []}
                                   onChange={(v) => setEndpoint(v)}/>
                    <Button label="Select"
                            onClick={()=> setApiLocation(endpoint)}
                            progress={progress}
                            error={failed}
                            style={{height: 38, marginBottom: 9}}
                    />
                </div>
            </div>
        </div>
    }

    return children;
}

export default ApiUrlSelector;
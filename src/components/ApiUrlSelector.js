import React, {useState} from "react";
import {apiUrlStorage} from "../remote_api/entrypoint";
import storageValue from "../misc/localStorageDriver";
import {BsHddNetwork} from "react-icons/bs";
import TuiApiUrlInput from "./elements/tui/TuiApiUrlInput";
import Button from "./elements/forms/Button";
import Grid from "@mui/material/Grid";
import PaperBox from "./elements/misc/PaperBox";
import RemoteService from "../remote_api/endpoints/raw";
import {getFetchError} from "../remote_api/remoteState";

const ApiUrlSelector = ({children}) => {

    const [endpoint, setEndpoint] = useState(apiUrlStorage().read());
    const [apiLocation, setApiLocation] = useState(apiUrlStorage().read());
    const [errorMessage, setErrorMessage] = useState(null);
    const [progress, setProgress] = useState(false);

    const isValidUrl = (string) => {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const isValidAPIUrl = () => {
        if (!apiLocation) {
            return false
        }

        if (!isValidUrl(apiLocation)) {
            return false
        }

        return true
    }

    const handleApiChange = async (endpoint) => {
        if (isValidUrl(endpoint)) {
            try {
                setProgress(true)
                setErrorMessage(null)
                const data = await RemoteService.fetch({
                    url: "/info/version/details",
                    baseURL: endpoint
                })
                new storageValue('version').save(data)
                apiUrlStorage().save(endpoint)
                const storedUrls = new storageValue('tracardi-api-urls')
                let historicalEndpoints = storedUrls.read([]);
                if (!historicalEndpoints.includes(endpoint)) {
                    historicalEndpoints.push(endpoint);
                    storedUrls.save(historicalEndpoints, []);
                }
                setApiLocation(endpoint)

            } catch (e) {
                setErrorMessage("API response: " + getFetchError(e))
            } finally {
                setProgress(false)
            }

        } else {
            setErrorMessage("This API URL seems to be invalid.")
        }
    }

    if (isValidAPIUrl() === false) {
        return <PaperBox>
            <BsHddNetwork size={50} style={{color: "#666"}}/>
            <h1 style={{fontWeight: 300}}>Select TRACARDI server</h1>
            <p>Type or select TRACARDI API Url.</p>
            <Grid container display="flex" justifyContent="center">
                <Grid item xs={8} style={{display: "flex", justifyContent: "right", flexDirection: "column"}}>
                    <TuiApiUrlInput
                        label="API Endpoint URL"
                        value={apiLocation || apiUrlStorage().read() || ""}
                        options={new storageValue('tracardi-api-urls').read([])}
                        onChange={(v) => setEndpoint(v)}
                        errorMessage={errorMessage}
                    />
                    <Button label="Select"
                            onClick={() => handleApiChange(endpoint)}
                            progress={progress}
                    />
                </Grid>
            </Grid>
        </PaperBox>
    }

    return children;
}

export default ApiUrlSelector;
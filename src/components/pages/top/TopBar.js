import SponsorButton from "../../elements/misc/SponsorButton";
import ReadOnlyInput from "../../elements/forms/ReadOnlyInput";
import {getApiUrl, resetApiUrlConfig} from "../../../remote_api/entrypoint";
import {track} from "../../../remote_api/track";
import version from "../../../misc/version";
import NeedHelpButton from "../../elements/misc/NeedHelpButton";
import React, {useContext} from "react";
import "./TopBar.css";
import useTheme from "@mui/material/styles/useTheme";
import {KeyCloakContext} from "../../context/KeyCloakContext";

export default function TopBar({children}) {

    const theme = useTheme();
    const authContext = useContext(KeyCloakContext)

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        authContext.logout()
        window.location.replace("/");
    }

    const style = {
        // backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black
    }

    return <div className="TopBar" style={style}>
        <h1 className="Title">{children}</h1>
        <span className="Info">
                <SponsorButton/>
                <ReadOnlyInput
                    label="Tracardi API"
                    value={getApiUrl()}
                    onReset={handleEndpointReset}/>
                <span onClick={() => {
                    track("9d9230c3-def2-451a-9b52-c554686f3e27", 'tracardi-need-help', {
                        version: version()
                    }).then(() => {
                    })
                }
                }><NeedHelpButton/></span>
            </span>

    </div>
}
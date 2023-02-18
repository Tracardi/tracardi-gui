import SponsorButton from "../../elements/misc/SponsorButton";
import ReadOnlyInput from "../../elements/forms/ReadOnlyInput";
import {getApiUrl, resetApiUrlConfig} from "../../../remote_api/entrypoint";
import {track} from "../../../remote_api/track";
import version from "../../../misc/version";
import NeedHelpButton from "../../elements/misc/NeedHelpButton";
import React, {useContext} from "react";
import {logout} from "../../authentication/login";
import "./TopBar.css";
import {DataContext} from "../../AppBox";

export default function TopBar({children}) {

    const production = useContext(DataContext)

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        logout()
        window.location.reload()
    }

    let style = {}

    if(production) {
        style = {
            backgroundColor: "#ffebee"
        }
    }

    return <div className="TopBar" style={style}>
        <h1 className="Title">{children}</h1>
        <span className="Info">
                <SponsorButton/>
                <ReadOnlyInput
                    label="Tracardi API"
                    value={getApiUrl()}
                    onReset={handleEndpointReset}/>
                <span onMouseEnter={() => {
                    track("9d9230c3-def2-451a-9b52-c554686f3e27", 'tracardi-need-help', {
                        version: version()
                    }).then(() => {
                    })
                }
                }><NeedHelpButton/></span>
            </span>

    </div>
}
import React from "react";
import "./NeedHelpButton.css";
import {BsHeart} from "react-icons/bs";
import {track} from "../../../remote_api/track";
import version from "../../../misc/version";
import IconButton from "./IconButton";

export default function SponsorButton() {

    const external = (url, newWindow = false) => {
        if (newWindow === true) {
            window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            window.location.href = url;
        }
    }

    const handleClick = () => {
        track("9d9230c3-def2-451a-9b52-c554686f3e27", 'tracardi-sponsorship-clicked', {
            version: version()
        }).then(() => {
            external("http://www.opencollective.com/tracardi-cdp")
        }).catch(() => {
            external("http://www.opencollective.com/tracardi-cdp")
        })
    }

    return <IconButton
            label="Sponsor"
            selected={true}
            style={{marginRight: 10}}
            onClick={handleClick}>
            <BsHeart size={20}/>
        </IconButton>

}
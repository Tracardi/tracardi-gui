import Button from "../forms/Button";
import React from "react";
import "./NeedHelpButton.css";
import {BsHeart} from "react-icons/bs";

export default function SponsorButton() {

    const external = (url, newWindow = false) => {
        if (newWindow === true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }
    }

    return <div>
        <Button label="Sponsor"
                selected={true}
                icon={<BsHeart size={20}/>}
                style={{padding: "6px 14px", marginBottom: 10, marginRight: 5}}
                onClick={external("http://www.opencollective.com/tracardi-cdp")}
        ></Button>
    </div>

}
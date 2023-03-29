import {BsPhone, BsTablet, BsDisplay} from "react-icons/bs";
import React from "react";

export default function OsIcon({platform, device}) {
    const devices = {
        "pc": <BsDisplay size={20} style={{marginRight: 5}}/>,
        "tablet": <BsTablet size={20} style={{marginRight: 5}}/>,
        "mobile": <BsPhone size={20} style={{marginRight: 5}}/>,
    }
    return <>{device in devices ? devices[device]: device} {platform} </>
}
import React from "react";

export default function IconLabel({icon, value, style}) {
    if(value==='utc') {
        value = "UTC"
    }

    return <span className="flexLine" style={style}>{icon} {value}</span>
}
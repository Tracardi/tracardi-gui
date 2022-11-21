import React from "react";

export default function IconLabel({icon, value, style}) {
    return <span className="flexLine" style={style}>{icon} {value}</span>
}
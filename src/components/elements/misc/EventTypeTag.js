import React from "react";
import {BsPersonX} from "react-icons/bs";

export default function EventTypeTag({eventType, profile}) {
    if(!profile || profile===null)
        return <span title="Profile-less event" style={{display: "inline-flex", alignItems: "center", padding: "0 7px", borderRadius: 4, backgroundColor: "#d7ccc8"}}><BsPersonX size={18} style={{marginRight: 8}}/>{eventType}</span>
    return <>{eventType}</>
}
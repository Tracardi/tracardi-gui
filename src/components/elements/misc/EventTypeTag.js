import React from "react";
import {BsPersonX} from "react-icons/bs";

export default function EventTypeTag({eventType, profile}) {
    if (!profile || profile === null)
        return <span title="Profile-less event" style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            borderRadius: 5,
            backgroundColor: "#d7ccc8",
            height: 22,
        }}><BsPersonX size={18} style={{marginRight: 8}}/>{eventType}</span>
    return <>{eventType}</>
}
import React from "react";
import {BsPersonX} from "react-icons/bs";
import "./HighlightedTag.css";

export default function EventTypeTag({eventType, profile}) {
    return <span className="HighlightTag" style={{backgroundColor: "rgba(0, 0, 0, 0.08)"}}>
        {(!profile || profile === null) && <BsPersonX size={18} style={{marginRight: 8}}/>}
        {eventType}
    </span>
}
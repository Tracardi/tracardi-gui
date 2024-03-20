import React from "react";
import "./HighlightedTag.css";

export default function EventWarnings({eventMetaData}) {

    if (eventMetaData?.warning) {
        return <span style={{
            backgroundColor: "#ef6c00",
            color: "white"
        }} className="HighlightTag">Warning</span>
    }
    return ""
}
import React from "react";
import "./HighlightedTag.css";

export default function EventErrorTag({eventMetaData}) {

    if (eventMetaData?.error) {
        return <span style={{
            backgroundColor: "#d81b60",
            color: "white",
        }} className="HighlightTag">Error</span>
    }
    return ""
}
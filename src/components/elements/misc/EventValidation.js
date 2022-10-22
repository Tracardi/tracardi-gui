import React from "react";
import "./HighlightedTag.css";

export default function EventValidation({eventMetaData}) {

    if (!eventMetaData?.valid) {
        return <span className="HighlightTag" style={{
            backgroundColor: "#d81b60",
            color: "white"
        }} title="Invalid event has incorrect data.">
        Invalid
        </span>
    }
    return ""
}
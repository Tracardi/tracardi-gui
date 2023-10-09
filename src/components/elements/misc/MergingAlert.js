import React from "react";
import "./HighlightedTag.css";

export default function MergingAlert({eventMetaData}) {

    if (eventMetaData?.merge) {
        return <span style={{
            backgroundColor: "#00c49f",
            color: "white"
        }} className="HighlightTag">Identification Point</span>
    }
    return ""
}
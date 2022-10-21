import React from "react";

export default function EventValidation({eventMetaData}) {

    if (!eventMetaData?.valid) {
        return <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            marginTop: 2,
            borderRadius: 5,
            backgroundColor: "#d81b60",
            color: "white",
            fontSize: "90%",
            cursor: "help",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden"
        }} title="Invalid event has incorrect data.">
        Invalid
        </span>
    }
    return ""
}
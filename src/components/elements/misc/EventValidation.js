import React from "react";

export default function EventValidation({eventMetaData}) {

    if (!eventMetaData.valid) {
        return <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            marginTop: 2,
            borderRadius: 5,
            backgroundColor: "#d81b60",
            color: "white",
            height: 22,
            fontSize: "90%",
        }}>
        Invalid
        </span>
    }
    return ""
}
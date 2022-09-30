import React from "react";

export default function EventWarnings({eventMetaData}) {

    if (eventMetaData.warning) {
        return <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            marginTop: 2,
            borderRadius: 5,
            backgroundColor: "#ef6c00",
            color: "white",
            height: 22,
            fontSize: "90%",
        }}>Warnings</span>
    }
    return ""
}
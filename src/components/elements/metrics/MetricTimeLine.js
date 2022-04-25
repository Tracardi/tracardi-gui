import React from "react";

export default function MetricTimeLine({children}) {
    return <div style={{display: "flex", backgroundColor: "white",
        padding: "0 5px",
        borderRadius: 5,
        margin: 4,
        width: "fit-content"}}>
        {children}
    </div>
}
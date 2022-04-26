import React from "react";

export default function MetricTimeLine({children, fitContent=true}) {
    return <div style={{display: "flex", backgroundColor: "whitesmoke",
        padding: "0 10px",
        borderRadius: 5,
        margin: 8,
        width: fitContent ? "fit-content" : "auto"}}>
        {children}
    </div>
}
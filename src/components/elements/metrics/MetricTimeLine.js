import React from "react";

export default function MetricTimeLine({children, onClick, fitContent = true}) {
    return <div style={{
        display: "flex",
        backgroundColor: "whitesmoke",
        borderRadius: 5,
        margin: 8,
        width: fitContent ? "fit-content" : "auto",
        cursor: (!onClick) ? "initial" : "pointer",
    }}
                onClick={() => {onClick && onClick()}}>
        {children}
    </div>
}
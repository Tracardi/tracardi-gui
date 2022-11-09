import React from "react";

export default function MetricTimeLine({children, onClick, fitContent = true}) {
    return <div style={{
        display: "flex",
        backgroundColor: "white",
        borderRadius: 15,
        margin: 8,
        padding: 10,
        width: fitContent ? "fit-content" : "auto",
        cursor: (!onClick) ? "initial" : "pointer",
    }}
                onClick={() => {onClick && onClick()}}>
        {children}
    </div>
}
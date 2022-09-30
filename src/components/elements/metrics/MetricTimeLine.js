import React from "react";

export default function MetricTimeLine({children, onClick}) {
    return <div style={{
        display: "flex",
        backgroundColor: "whitesmoke",
        borderRadius: 5,
        width: "inherit",
        height: "inherit",
        cursor: (!onClick) ? "initial" : "pointer",
    }}
                onClick={() => {onClick && onClick()}}>
        {children}
    </div>
}
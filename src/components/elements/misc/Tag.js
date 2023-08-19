import React from "react";

export default function Tag({children, style, tip, backgroundColor="#ccc", color="#000"}) {
    style = {...style, backgroundColor, color, display: "inline-flex", alignItems: "center", padding: "1px 10px", borderRadius: 7, marginRight: 5, marginTop: 2}
    if(tip) {
        style = {...style, cursor: "help"}
    }
    return <span
        title={tip}
        style={style}>
        {children}
</span>
}
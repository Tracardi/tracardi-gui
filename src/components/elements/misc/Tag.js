import React from "react";

export default function Tag({children, style, backgroundColor="#ccc", color="#000"}) {
    return <span
        style={{...style, backgroundColor, color, display: "inline-flex", alignItems: "center", padding: "1px 10px", borderRadius: 7, marginRight: 5, marginTop: 2}}>
        {children}
</span>
}
import React from "react";

export default function Tag({children, backgroundColor="#ccc", color="#000"}) {
    return <span
        style={{backgroundColor, color, display: "inline-flex", alignItems: "center", padding: "0 7px", borderRadius: 4, marginRight: 5}}>
        {children}
</span>
}
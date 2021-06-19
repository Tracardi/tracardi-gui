import React from "react";

export default function KeyValueFragment({name, value}) {
    return <div style={{paddingLeft: "5px"}}>
        <div style={{fontWeight: 400, minWidth: 100, display: "inline-block", padding: 5}}>{name}:</div>
        <span style={{
            padding: 5,
            borderBottom: "solid 1px #ccc",
            display: "inline-block",
            minWidth: 450,
        }}>{value}</span>
    </div>
}
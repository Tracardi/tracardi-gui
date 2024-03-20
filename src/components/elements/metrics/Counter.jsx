import React from "react";
import {abbreviateNumber, round} from "../../../misc/converters";
export default function Counter({label, value, subValue, subValueSuffix = "", width=120, hint, margin=10, padding=15}) {

    return <div style={{width: width, backgroundColor: "rgba(128,128,128, 0.2)", borderRadius: 10, padding: padding, margin: margin, fontFamily: "Lato"}}>
        <div style={{fontWeight: 400, fontSize: "120%", textAlign: "center"}}>{label}</div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "250%",
            fontWeight: 600
        }}>{abbreviateNumber(value)}</div>
        <div style={{textAlign: "center"}}>{subValue && round(subValue,3)} {subValueSuffix}</div>
        {hint && <div style={{ textAlign: "center"}}>{hint}</div>}
    </div>
}


export function BigCounter({label, value, hint}) {

    return <div style={{padding: 15, margin: "0px 5px", fontFamily: "Lato", textAlign: "left"}}>
        <div style={{fontWeight: 400, fontSize: "140%"}}>{label}</div>
        <div style={{
            fontSize: "500%",
            fontWeight: 600
        }}>{abbreviateNumber(value)}</div>
        {hint && <div style={{ textAlign: "left"}}>{hint}</div>}
    </div>
}
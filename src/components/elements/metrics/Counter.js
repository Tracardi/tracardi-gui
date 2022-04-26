import React from "react";
import {abbreviateNumber, round} from "../../../misc/converters";
export default function Counter({label, value, subValue, subValueSuffix = "",width=120}) {

    return <div style={{width: width, padding: 15, margin: "0px 5px", fontFamily: "Lato"}}>
        <div style={{fontWeight: 400}}>{label}</div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "200%",
            color: "#1976d2",
            fontWeight: 800
        }}>{abbreviateNumber(value)}</div>
        {subValue && <div style={{fontSize: "80%", textAlign: "center"}}>{round(subValue,3)} {subValueSuffix}</div>}
    </div>
}
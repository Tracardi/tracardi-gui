import {BsEyeSlash} from "@react-icons/all-files/bs/BsEyeSlash";
import React from "react";

export default function NoData({header, children}) {
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: 20}}>
        <BsEyeSlash size={50} style={{color: "#666"}}/>
        <h1 style={{fontWeight: 300}}>{header}</h1>
        {children}
    </div>
}
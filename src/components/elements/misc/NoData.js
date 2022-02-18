import {BsEyeSlash} from "react-icons/bs";
import React from "react";

export default function NoData({icon, header, children}) {

    const Icon = () => {
        if(icon) {
            return icon
        }
        return <BsEyeSlash size={50} style={{color: "#666"}}/>
    }

    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: 20}}>
        <Icon/>
        <h1 style={{fontWeight: 300}}>{header}</h1>
        {children}
    </div>
}
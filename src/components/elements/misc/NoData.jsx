import {BsEyeSlash} from "react-icons/bs";
import React from "react";

export default function NoData({icon, header, children, style, iconColor="#666", fontSize="2em"}) {

    const Icon = () => {
        if(icon) {
            return icon
        }
        return <BsEyeSlash size={50} style={{color: iconColor}}/>
    }

    return <div style={{...style, display: "flex", flexDirection: "column", alignItems: "center", padding: 20, width: "100%"}}>
        <Icon/>
        <h1 style={{fontWeight: 300, fontSize}}>{header}</h1>
        {children}
    </div>
}
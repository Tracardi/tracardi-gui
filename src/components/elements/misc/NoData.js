import {BsEyeSlash} from "react-icons/bs";
import React from "react";
import "./NoData.css";

export default function NoData({icon, header, children, style, iconColor="rgba(128,128,128, .6)", fontSize="2em"}) {

    const Icon = () => {
        if(icon) {
            return icon
        }
        return <BsEyeSlash size={50} style={{color: iconColor}}/>
    }

    return <div className="NoData" style={style}>
        <Icon/>
        <h1 style={{margin: 10, fontWeight: 300, fontSize}}>{header}</h1>
        {children}
    </div>

}


import React from "react";
import {BsHash} from "react-icons/bs";

export default function IdLabel({label, size=20, style}) {
    return <span className="flexLine" style={style}><BsHash size={size}/> {label}</span>
}
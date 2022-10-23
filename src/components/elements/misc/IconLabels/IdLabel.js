import React from "react";
import {BsHash} from "react-icons/bs";

export default function IdLabel({label, size=20}) {
    return <span className="flexLine"><BsHash size={size}/> {label}</span>
}
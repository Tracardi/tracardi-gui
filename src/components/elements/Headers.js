import React from "react";
import "./Headers.css";

export function MiniHeader({...props}) {
    return <div className="MiniHeader">{props.children}</div>
}

export const SemiHeader = ({children}) => {
    return <div className="SemiHeader">{children}</div>
}
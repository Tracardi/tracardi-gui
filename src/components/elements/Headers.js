import React from "react";
import "./Headers.css";

export function MiniHeader({...props}) {
    return <div className="MiniHeader">{props.children}</div>
}
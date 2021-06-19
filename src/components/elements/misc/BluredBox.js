import React from "react";
import "./BluredBox.css";

export default function BluredBox({children, style}) {
    return <div className="BluredBox" style={style}>
        {children}
    </div>
}
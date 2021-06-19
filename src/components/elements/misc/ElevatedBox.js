import React from "react";
import "./ElevatedBox.css";

export default function ElevatedBox({children, style}) {
    return <div className="ElevatedBox" style={style}>
        {children}
    </div>
}
import React from "react";
import "./Rows.css";

export default function Rows({children, style}) {
    return <div className="Rows" style={style}>
        {children}
    </div>
}
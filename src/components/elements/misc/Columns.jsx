import React from "react";
import "./Columns.css";

export default function Columns({children, style}) {
    return <div className="Columns" style={style}>
        {children}
    </div>
}
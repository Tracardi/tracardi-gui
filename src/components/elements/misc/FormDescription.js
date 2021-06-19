import React from "react";
import "./FormDescription.css";

export default function FormDescription({children, style}) {
    return <div className="FormDescription" style={style}>
        {children}
    </div>
}
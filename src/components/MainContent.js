import React from "react";
import "./MainContent.css";

export default function MainContent({children, style}) {
    return <div className="MainContent" style={style}>
        {children}
    </div>
}
import React from "react";
import "./FormSubHeader.css";

export default function FormSubHeader({children}) {
    return <h2 className="FormSubHeader">
        {children}
    </h2>
}
import React from "react";
import "./FormHeader.css";

export default function FormHeader({children}) {
    return <h1 className="FormHeader">
        {children}
    </h1>
}
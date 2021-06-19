import "./IconButton.css";
import React from "react";

export default function IconButton({onClick, children, selected, label}) {
    return <span title={label ? label : ""}
                 className={"IconButton" + ((selected) ? " IconButtonSelected" : " IconButtonRegular")}
                 onClick={(e)=>onClick(e)}>
        {children}
    </span>
}
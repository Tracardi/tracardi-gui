import React from "react";
import {BsXLg} from "react-icons/bs";
import "./HOverX.css"

export default function Tag({children, style, tip, backgroundColor = "#ccc", color = "#000"}) {
    style = {
        backgroundColor,
        color,
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        fontSize: "90%",
        borderRadius: 5,
        marginRight: 5,
        marginTop: 2,
        whiteSpace: "nowrap", ...style
    }
    if (tip) {
        style = {...style, cursor: "help"}
    }
    return <span
        title={tip}
        style={style}>
        {children}
</span>
}

export function OnOverTag({
                              label,
                              onClick,
                              onDeleteClick,
                              style,
                              tip,
                              backgroundColor = "#ccc",
                              color = "#000"
                          }) {

    style = {
        backgroundColor,
        color,
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        padding: "2px 10px",
        fontSize: "90%",
        borderRadius: 5,
        marginRight: 5,
        whiteSpace: "nowrap", ...style
    }
    if (tip) {
        style = {...style, cursor: "help"}
    }
    return <div title={tip}
                 style={style}
                 className="Xover">
            <label onClick={onClick}
                   style={{padding: "5px 15px 5px 5px", cursor: "pointer", textTransform: "uppercase"}}>
                {label}
            </label>
            <span style={{padding: 5, display: "inherit"}}><BsXLg size={14} onClick={onDeleteClick}/></span>
        </div>
}
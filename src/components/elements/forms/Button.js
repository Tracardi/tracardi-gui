import React from "react";
import "./Button.css";

export default function Button({label, onClick, className, style, icon, disabled}) {

    let visuals = (className) ? className : "Button";
    if(typeof disabled === "undefined") {
        visuals += " EnabledButton";
    } else if(disabled !== true) {
        visuals += " EnabledButton";
    } else {
        visuals += " DisabledButton";
    }
    const iconEl = (icon) ? icon : ""

    const onButtonClick = (ev) => {
        ev.preventDefault();
        if (typeof onClick !== "undefined" && (typeof disabled === "undefined" || disabled !== true)) {
            onClick(ev);
        }
    }

    return <nav onClickCapture={onButtonClick} className={visuals} style={style}>
        {iconEl}
        {label}
    </nav>
}
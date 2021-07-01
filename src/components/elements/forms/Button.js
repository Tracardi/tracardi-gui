import React from "react";
import "./Button.css";
import IconCircularProgress from "../progress/IconCircularProgress";
import {AiOutlineCheckCircle} from "@react-icons/all-files/ai/AiOutlineCheckCircle";

export default function Button({label, onClick, className, style, icon, disabled, selected=false, progress=false}) {

    let visuals = (selected) ? "ButtonSelected Button" : "Button";
    visuals = (className) ? className : visuals;
    if (progress === true) {
        visuals += " DisabledButton";
    } else if (typeof disabled === "undefined") {
        visuals += " EnabledButton";
    } else if (disabled !== true) {
        visuals += " EnabledButton";
    } else {
        visuals += " DisabledButton";
    }
    const iconEl = (icon) ? icon : <AiOutlineCheckCircle size={20}/>

    const onButtonClick = (ev) => {
        if(!disabled && !progress) {
            ev.preventDefault();
            if (typeof onClick !== "undefined" && (typeof disabled === "undefined" || disabled !== true)) {
                onClick(ev);
            }
        }
    }

    const RenderContent = ({processing}) => {
        if (processing) {
            return <>
                <span style={{minWidth: 24, display: "flex"}}><IconCircularProgress/></span>{label}
            </>
        }
        return <>
            <span style={{minWidth: 24, display: "flex"}}>{iconEl}</span>
            {label}
        </>
    }

    return <button onClickCapture={onButtonClick} className={visuals} style={style}>
        <RenderContent processing={progress}/>
    </button>
}
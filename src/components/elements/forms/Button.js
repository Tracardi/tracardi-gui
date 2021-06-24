import React, {useState} from "react";
import "./Button.css";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import IconCircularProgress from "../progress/IconCircularProgress";
import {VscCheck} from "@react-icons/all-files/vsc/VscCheck";
import {BsCheck} from "@react-icons/all-files/bs/BsCheck";
import {AiOutlineCheckCircle} from "@react-icons/all-files/ai/AiOutlineCheckCircle";

export default function Button({label, onClick, className, style, icon, disabled, progress=false}) {

    let visuals = (className) ? className : "Button";
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

    return <nav onClickCapture={onButtonClick} className={visuals} style={style}>
        <RenderContent processing={progress}/>
    </nav>
}
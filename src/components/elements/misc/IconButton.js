import "./IconButton.css";
import React from "react";
import IconicCircularProgress from "../progress/IconicCircularProgress";

export default function IconButton({onClick, children, selected, label, progress}) {

    return <span title={label ? label : ""}
                 className={"IconButton" + ((selected) ? " IconButtonSelected" : " IconButtonRegular")}
                 onClick={(e)=> onClick(e)}>
        <IconicCircularProgress color="primary" icon={children} progress={progress}/>
    </span>
}
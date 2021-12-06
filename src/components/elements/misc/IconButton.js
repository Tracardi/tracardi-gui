import "./IconButton.css";
import React from "react";
import IconicCircularProgress from "../progress/IconicCircularProgress";

export default function IconButton({onClick, children, selected, label, progress}) {

    const handleClick = (value) => {
        if(onClick) {
            onClick(value);
        }
    }

    return <span title={label ? label : ""}
                 className={"IconButton" + ((selected) ? " IconButtonSelected" : " IconButtonRegular")}
                 onClick={(e)=> handleClick(e)}>
        <IconicCircularProgress color="primary" icon={children} progress={progress}/>
    </span>
}
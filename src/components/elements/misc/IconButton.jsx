import "./IconButton.css";
import React from "react";
import IconicCircularProgress from "../progress/IconicCircularProgress";
import useTheme from "@mui/material/styles/useTheme";

export default function IconButton({onClick, children, selected, label, progress, style}) {

    const theme = useTheme()

    const handleClick = (value) => {
        if(onClick) {
            onClick(value);
        }
    }

    if(selected) {
        style = {
             backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, ...style,
        }
    } else {
        style = {
            ...style, color: theme.palette.primary.main
        }
    }

    return <span title={label ? label : ""}
                 style={style}
                 className="IconButton"
                 onClick={(e)=> handleClick(e)}>
        <IconicCircularProgress color="primary" icon={children} progress={progress}/>
    </span>
}
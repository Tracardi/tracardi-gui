import React from "react";
import {isString} from "../../../misc/typeChecking";
import "./HighlightedTag.css";
import useTheme from "@mui/material/styles/useTheme";

export default function EventStatusTag({label, defaultSuccessLabel='processed', title="Status of the event."}) {

    const theme = useTheme()

    const getColor = () => {
        if (label === defaultSuccessLabel) {
            return "#00c49f"
        }
        return theme.palette.primary.main
    }

    function capitalizeFirstLetter(string) {
        if (isString(string)) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    return <span
        style={{backgroundColor: getColor(), color: "white"}}
        className="HighlightTag"
        title={title}>
        {capitalizeFirstLetter(label)}
        </span>
}
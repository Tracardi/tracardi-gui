import React from "react";
import {isString} from "../../../misc/typeChecking";
import "./HighlightedTag.css";

export default function EventStatusTag({label}) {

    const getColor = () => {
        if (label === 'processed') {
            return "#00c49f"
        }
        return "#0088fe"
    }

    function capitalizeFirstLetter(string) {
        if (isString(string)) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    return <span
        style={{backgroundColor: getColor(), color: "white"}}
        className="HighlightTag"
        title="Status of the event.">
        {capitalizeFirstLetter(label)}
        </span>
}
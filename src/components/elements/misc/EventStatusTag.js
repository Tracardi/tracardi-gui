import React from "react";
import {isString} from "../../../misc/typeChecking";
export default function EventStatusTag({label}) {

    const getColor = () => {
        if (label==='processed') {
            return "#00c49f"
        }
        return "#0088fe"
    }

    function capitalizeFirstLetter(string) {
        if(isString(string)) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    return <span style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "90%",
        padding: "2px 10px",
        marginTop: 2,
        borderRadius: 5,
        backgroundColor: getColor(),
        color: "white",
        height: 22
    }}>
        {capitalizeFirstLetter(label)}
        </span>
}
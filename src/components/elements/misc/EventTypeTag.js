import React from "react";
import {BsPersonX} from "react-icons/bs";
import "./HighlightedTag.css";

export function capitalizeString(str) {
    // Split the string by the dash ("-")
    const parts = str.split('-');

    // Capitalize the first letter of each part and convert the rest to lowercase
    const transformedParts = parts.map(part => {
        const firstLetter = part.charAt(0).toUpperCase();
        const restOfWord = part.slice(1).toLowerCase();
        return firstLetter + restOfWord;
    });

    // Join the transformed parts with a space
    const transformedString = transformedParts.join(' ');

    return transformedString;
}

export default function EventTypeTag({event}) {

    const eventType =  event?.name || capitalizeString(event?.type)

    return <span className="HighlightTag" style={{backgroundColor: "rgba(0, 0, 0, 0.08)"}} title="Event type">
        {(!event.profile?.id || event.profile?.id === null) && <BsPersonX size={18} style={{marginRight: 8}}/>}
        {eventType} ({event?.type})
    </span>
}


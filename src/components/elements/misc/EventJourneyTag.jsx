import Tag from "./Tag";
import React from "react";
import {capitalizeString} from "./EventTypeTag";

export default function EventJourneyTag({children}) {
    return <Tag backgroundColor="#663dff" color="white" tip="Customer Journey State">{capitalizeString(children)}</Tag>
}
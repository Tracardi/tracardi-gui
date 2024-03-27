import Tag from "./Tag";
import React from "react";
import {capitalizeString} from "./EventTypeTag";

export default function EventAsyncTag({event}) {

    if(event?.config?.async === 'undefined') {
        return ""
    }

    let label;
    if(event?.config?.async === true) {
        label = "Asynchronous"
    } else {
        label = "Synchronous"
    }

    if(event?.config?.fire === true) {
        label = `${label} (Post Page Render)`
    }

    return <Tag backgroundColor="#777" color="white" tip="Asynchronous Event">{label}</Tag>
}
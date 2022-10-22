import TimeDifference from "../datepickers/TimeDifference";
import React from "react";
import {makeUtcStringTzAware} from "../../../misc/converters";

export default function DateValue({date}) {
    date = makeUtcStringTzAware(date)
    return <>
        <span style={{marginRight: 10}}>{date}</span> <TimeDifference date={date}/>
        </>
}
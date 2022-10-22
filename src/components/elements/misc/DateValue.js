import TimeDifference from "../datepickers/TimeDifference";
import React from "react";
import {makeUtcStringTzAware} from "../../../misc/converters";
import {BsClock} from "react-icons/bs";

export default function DateValue({date}) {
    date = makeUtcStringTzAware(date)
    return <span className="flexLine">
        <BsClock size={20}/>
        <span style={{marginRight: 10}} style={{margin: 5}}>{date}</span> <TimeDifference date={date}/>
        </span>
}
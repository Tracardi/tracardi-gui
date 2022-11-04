import TimeDifference from "../datepickers/TimeDifference";
import React, {useState} from "react";
import {makeUtcStringTzAware} from "../../../misc/converters";
import {BsClock} from "react-icons/bs";

export default function DateValue({date}) {

    const [local, setLocal] = useState(false)

    const handleTimeChange = () => {

    }

    date = makeUtcStringTzAware(date)
    return <span className="flexLine" onClick={handleTimeChange}>
        <BsClock size={20}/>
        <span style={{margin: 5, marginRight: 10}}>{date}</span> <TimeDifference date={date}/>
        </span>
}
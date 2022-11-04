import TimeDifference from "../datepickers/TimeDifference";
import React, {useState} from "react";
import {formatDate, makeUtcStringTzAware} from "../../../misc/converters";
import {BsClock, BsGlobe} from "react-icons/bs";

export default function DateValue({date}) {

    const [local, setLocal] = useState(true)

    const handleTimeChange = () => {
        setLocal(!local)
    }

    if(local) {
        date = makeUtcStringTzAware(date)
    } else {
        date = formatDate(date)
    }

    return <span className="flexLine" style={{cursor: "pointer"}} onClick={handleTimeChange}>
        {local ? <BsClock size={20}/> : <BsGlobe size={20}/>}
        <span style={{margin: 5, marginRight: 10}}>{date}</span> <TimeDifference date={date}/>
        </span>
}
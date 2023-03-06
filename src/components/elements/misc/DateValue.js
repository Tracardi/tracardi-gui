import TimeDifference from "../datepickers/TimeDifference";
import React, {useState} from "react";
import {formatDate, formatDateIso, makeUtcStringTzAware, makeUtcStringTzAwareIso} from "../../../misc/converters";
import {BsClock, BsGlobe} from "react-icons/bs";

export default function DateValue({date, style}) {

    const [local, setLocal] = useState(true)

    const handleTimeChange = () => {
        setLocal(!local)
    }
    let iso_date;
    if(local) {
        iso_date = makeUtcStringTzAwareIso(date)
        date = makeUtcStringTzAware(date)
    } else {
        iso_date = formatDateIso(date)
        date = formatDate(date)
    }

    return <span className="flexLine" style={{...style, cursor: "pointer"}} onClick={handleTimeChange}>
        {local ? <BsClock size={20}/> : <BsGlobe size={20}/>}
        <span style={{margin: 5, marginRight: 10}}>{date || '<empty>'}</span> <TimeDifference date={iso_date}/>
        </span>
}
import TimeDifference from "../datepickers/TimeDifference";
import React, {useState} from "react";
import {makeTzAwareDate} from "../../../misc/converters";
import {BsClock, BsGlobe} from "react-icons/bs";
import {formatUTCDate} from "../../../misc/date";

export default function DateValue({date: dateString, style}) {

    const [local, setLocal] = useState(true)

    const handleTimeChange = () => {
        setLocal(!local)
    }
    let iso_date;
    let date;

    const dateTz = makeTzAwareDate(dateString)

    if(dateTz !== null) {

        iso_date = dateTz.toISOString()

        if(local) {
            date = dateTz.toLocaleString()
        } else {
            date = formatUTCDate(dateTz)
        }
    } else {
        date = null
        iso_date = null
    }

    return <span className="flexLine" style={{...style, cursor: "pointer"}} onClick={handleTimeChange}>
        {local ? <BsClock size={20}/> : <BsGlobe size={20}/>}
        <span style={{margin: 5, marginRight: 10}}>{date || '<empty>'}</span> <TimeDifference date={iso_date}/>
        </span>
}
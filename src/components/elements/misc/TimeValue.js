import {BsClock} from "react-icons/bs";
import React from "react";

export default function TimeValue({time, icon=true, seconds=true}) {
    if(!time) {
        return "<Invalid date>"
    }
    const clockIcon = icon ? <BsClock size={20} style={{marginRight: 5}}/> : ""
    return <> {clockIcon} {Math.floor(time / 60 / 60)}h:{Math.floor(time / 60)}m:{Math.floor(time)%60}s {seconds && <sup>({Math.floor(time)}s)</sup>}</>
}
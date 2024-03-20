import './KeyValueDesc.css';
import React from "react";
import {IoCheckmarkCircleOutline, IoCloseCircleOutline, IoBanOutline} from "react-icons/io5";

export default function KeyValueDesc({label, value, description}) {

    const v = (value) => {
        if(typeof value === "boolean") {
            return value ? <IoCheckmarkCircleOutline size={30} style={{color: "green"}}/> : <IoCloseCircleOutline size={30} style={{color: "crimson"}}/>
        } else if (value === null) {
            return <IoBanOutline size={30} style={{color: "#999"}}/>
        } else {
            return value;
        }
    }

    return <div className="KeyValueDesc">
        <div className="KeyDesc">
            <h1>{label}</h1>
            <aside>{description}</aside>
        </div>
        <div className="Value">
            {v(value)}
        </div>
    </div>
}
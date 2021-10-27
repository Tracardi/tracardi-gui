import './KeyValueDesc.css';
import React from "react";
import {IoCheckmarkCircleOutline} from "@react-icons/all-files/io5/IoCheckmarkCircleOutline";
import {IoCloseCircleOutline} from "@react-icons/all-files/io5/IoCloseCircleOutline";
import {IoBanOutline} from "@react-icons/all-files/io5/IoBanOutline";

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
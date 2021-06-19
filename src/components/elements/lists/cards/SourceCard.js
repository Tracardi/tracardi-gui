import React from 'react';
import "./SourceCard.css";
import "./Card.css";
import {VscVmRunning} from "@react-icons/all-files/vsc/VscVmRunning";
import {VscVmOutline} from "@react-icons/all-files/vsc/VscVmOutline";

export default function SourceCard({data, onClick}) {

    return (
        <div onClick={(ev)=>{onClick(data.id)}} className="Card">
            <span className="enabled">{data.enabled ? <VscVmRunning size={24} style={{color: "darkgreen"}}/>: <VscVmOutline size={24} style={{color: "darkred"}}/>}</span>
            <span className="name">{data.name}</span>
        </div>
    );
}
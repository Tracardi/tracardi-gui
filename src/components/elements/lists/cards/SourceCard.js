import React from 'react';
import "./SourceCard.css";
import "./Card.css";
import {VscVmRunning, VscVmOutline} from "react-icons/vsc";

export default function SourceCard({data, onClick}) {

    return (
        <div onClick={(ev)=>{onClick(data.id)}} className="Card">
            <span className="enabled">{data.enabled ? <VscVmRunning size={24} style={{color: "darkgreen"}}/>: <VscVmOutline size={24} style={{color: "darkred"}}/>}</span>
            <span className="name">{data.name}</span>
        </div>
    );
}
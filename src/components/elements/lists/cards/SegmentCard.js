import React from 'react';
import "./SegmentCard.css";
import "./Card.css";
import {VscVmRunning} from "@react-icons/all-files/vsc/VscVmRunning";
import {VscVmOutline} from "@react-icons/all-files/vsc/VscVmOutline";
import {GrCycle} from "@react-icons/all-files/gr/GrCycle";

export default function SegmentCard({data, onClick}) {

    return (
        <div onClick={(ev)=>{onClick(data.id)}} className="Card">
            <span className="enabled">{data.enabled ? <VscVmRunning size={24} style={{color: "darkgreen"}}/> :
                <VscVmOutline size={24} style={{color: "darkred"}}/>}</span>
            <span className="hidden">{data.isCyclic ? <GrCycle size={24}/> : <GrCycle size={24}/>}</span>
            <span className="name">{data.name}</span>
            <span className="name">{data.source?.id}</span>
        </div>

);
}
import React from 'react';
import "./Card.css";
import "./RuleCard.css";
import {GrCycle} from "@react-icons/all-files/gr/GrCycle";
import {VscVmRunning} from "@react-icons/all-files/vsc/VscVmRunning";
import {VscVmOutline} from "@react-icons/all-files/vsc/VscVmOutline";

export default function RuleCard({data, onClick}) {

    return (
            <div onClick={(ev)=>{onClick(data.id)}} className="Card RuleCard">
                <span className="enabled">{data.enabled ? <VscVmRunning size={24} style={{color: "darkgreen"}}/>: <VscVmOutline size={24} style={{color: "darkred"}}/>}</span>
                <span class="hidden">{data.isCyclic ? <GrCycle size={24}/> : <GrCycle size={24} />}</span>
                <span className="name">{data.name}</span>
                <span className="name">{data.event?.type}</span>
                <span className="name">{data.source?.name}</span>
                <span className="name">{data.flow?.name}</span>
            </div>
    );
}

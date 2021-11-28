import React from 'react';
import './RuleRow.css';
import {VscSymbolEvent} from "@react-icons/all-files/vsc/VscSymbolEvent";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import {BsGear} from "@react-icons/all-files/bs/BsGear";

const RuleRow = ({data, flow}) => {

    return (
        <div className="RuleRow">
            <span className="EventBox"><VscSymbolEvent size={20} style={{marginRight:10}}/> {data.event.type}</span>
            >>
            <span className="RuleBox">
                <BsGear size={20} style={{marginRight: 10}}/>
                {data.name}
            </span>
            >>
            <span className="RuleBox">
                <IoGitNetworkSharp size={20} style={{marginRight: 10}}/>
                {flow}
            </span>
        </div>
    );
}

export default RuleRow;

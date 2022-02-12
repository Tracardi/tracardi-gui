import React from 'react';
import './RuleRow.css';
import {VscSymbolEvent} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";
import {FaUncharted} from "react-icons/fa";

const RuleRow = ({data, flow}) => {

    return (
        <div className="RuleRow">
            <span className="RuleBox">{data.source.name}</span>
            >>
            <span className="EventBox"><VscSymbolEvent size={20} style={{marginRight:10}}/> {data.event.type}</span>
            >>
            <span className="RuleBox">
                <FaUncharted size={20} style={{marginRight: 5}}/>
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

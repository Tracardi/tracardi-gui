import React from 'react';
import './RuleRow.css';
import {VscSymbolEvent} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";

const RuleRow = ({data, flow}) => {

    return (
        <section>
            <div style={{margin: 5}}>{data.name}</div>
            <div className="RuleRow">
                <span className="RuleBox">{data.source.name}</span>
                >>
                <span className="EventBox"><VscSymbolEvent size={20} style={{marginRight:10}}/> {data.event.type}</span>
                >>
                <span className="RuleBox">
                <IoGitNetworkSharp size={20} style={{marginRight: 10}}/>
                    {flow}
            </span>
            </div>
        </section>
    );
}

export default RuleRow;

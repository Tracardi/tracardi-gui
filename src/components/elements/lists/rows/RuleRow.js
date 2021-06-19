import React from 'react';
import './RuleRow.css';
import EnabledIcon from "../../misc/EnabledIcon";
import {BsArrowRight} from "@react-icons/all-files/bs/BsArrowRight";
import {VscSymbolEvent} from "@react-icons/all-files/vsc/VscSymbolEvent";

const RuleRow = ({data}) => {

    return (
        <div className="RuleRow">
            <EnabledIcon enabled={data?.enabled} style={{marginRight: 10, marginTop:3}}/>
            <span className="event"><VscSymbolEvent size={20} style={{marginRight:10}}/> {data.event.type}</span>
            <BsArrowRight size={20} style={{marginRight:10, marginTop:5}}/>
            <span className="rule">
                {data.name}: {data.description}
            </span>
        </div>
    );
}

export default React.memo(RuleRow);

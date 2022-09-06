import React from 'react';
import './RuleRow.css';
import {VscSymbolEvent} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";
import { IconButton } from '@mui/material';
import { BsTrash } from 'react-icons/bs';

const RuleRow = ({data, flow, onDelete=null}) => {

    return (
        <section>
            <div style={{margin: 5}}>{data.name}</div>
            <div className="RuleRow">
                <span className="RuleBox">{data.source.name}</span>
                {">>"}
                <span className="EventBox"><VscSymbolEvent size={20} style={{marginRight:10}}/> {data.event.type}</span>
                {">>"}
                <span className="RuleBox">
                    <IoGitNetworkSharp size={20} style={{marginRight: 10}}/>
                        {flow}
                </span>
                {onDelete instanceof Function &&
                    <span className="DeleteButtonBox"> 
                        <IconButton onClick={() => onDelete(data.id, data.name)}>
                            <BsTrash color="#1565c0"/>
                        </IconButton>
                    </span>
                }
            </div>
        </section>
    );
}

export default RuleRow;

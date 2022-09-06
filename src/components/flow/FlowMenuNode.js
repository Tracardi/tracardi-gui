import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";
import {Tooltip} from "@mui/material";
import {BsCloud} from "react-icons/bs";

export default function FlowMenuNode({onDragStart, onDoubleClick, row}) {
    return <Tooltip title={row.plugin?.metadata?.desc ? row.plugin?.metadata?.desc: row.plugin?.metadata?.name}
                    placement="right"
    >
        <div className="menuNode"
                onDoubleClick={onDoubleClick}
                onDragStart={(event) =>
        onDragStart(event, row)} draggable>
        <div style={{display: "flex"}}>
            <FlowNodeIcons icon={row.plugin?.metadata?.icon}/>
            <div style={{marginLeft: 10}}>
                <div>{row.plugin?.metadata?.name}</div>
                <div style={{fontSize: "70%"}}>{row.plugin?.metadata?.brand} {row.plugin?.spec?.version}</div>
            </div>

        </div>
            {row.plugin?.metadata?.remote && <BsCloud size={20}/>}
        {row.plugin?.metadata?.pro && <span className="proTag">Pro</span>}
    </div></Tooltip>
}
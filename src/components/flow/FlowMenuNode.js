import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";
import {Tooltip} from "@mui/material";
import {BsCloud, BsStar} from "react-icons/bs";
import useTheme from "@mui/material/styles/useTheme";

export default function FlowMenuNode({onDragStart, onDoubleClick, row}) {

    const theme = useTheme();

    return <Tooltip title={row.plugin?.metadata?.desc ? row.plugin?.metadata?.desc : row.plugin?.metadata?.name}
                    placement="right"
    >

        <div className="menuNode"
             style={{color: theme.palette.common.black}}
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
            {row.plugin?.metadata?.remote && <BsCloud size={20} style={{marginRight: 5}}/>}
            {row.plugin?.metadata?.pro && <BsStar size={20} style={{marginRight: 5}}/>}
        </div>
    </Tooltip>
}
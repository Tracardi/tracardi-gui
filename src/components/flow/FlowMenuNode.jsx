import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";
import {BsCloud, BsStar} from "react-icons/bs";
import useTheme from "@mui/material/styles/useTheme";
import {styled} from '@mui/material/styles';

const NodeTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "rgba(128,128,128,0.3)",
        color: theme.palette.text.primary,
        maxWidth: 400,
        boxShadow: theme.shadows[1],
    },
}));

export default function FlowMenuNode({onDragStart, onDoubleClick, row}) {

    const theme = useTheme();

    return <NodeTooltip
        title={row.plugin?.metadata?.desc ? row.plugin?.metadata?.desc : row.plugin?.metadata?.name}
        placement="right"
        slotProps={{
            popper: {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, +14],
                        },
                    },
                ],
            },
        }}
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
    </NodeTooltip>
}
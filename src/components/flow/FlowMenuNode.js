import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";

export default function FlowMenuNode({onDragStart, row}) {
    return <div className="menuNode" onDragStart={(event) =>
        onDragStart(event, row)} draggable>
        <div style={{display: "flex"}}>
            <FlowNodeIcons icon={row.plugin?.metadata?.icon}/>
            <div style={{marginLeft: 5}}>
                <div>{row.plugin?.metadata?.name}</div>
                <div style={{fontSize: "70%"}}>{row.plugin?.spec?.version}</div>
            </div>

        </div>
        {row.plugin?.metadata?.pro && <span className="proTag">Pro</span>}
    </div>
}
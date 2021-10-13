import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";

export default function FlowMenuNode({onDragStart, row}) {
    return <div className="menuNode" onDragStart={(event) =>
        onDragStart(event, row)} draggable>
        <FlowNodeIcons icon={row.plugin?.metadata?.icon}/> <span style={{marginLeft: 5}}>{row.plugin?.metadata?.name}</span>
    </div>
}
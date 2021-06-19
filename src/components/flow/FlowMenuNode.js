import React from "react";
import FlowNodeIcons from "./FlowNodeIcons";

export default function FlowMenuNode({onDragStart, data}) {
    return <div className="menuNode" onDragStart={(event) =>
        onDragStart(event,data)} draggable>
        <FlowNodeIcons icon={data?.metadata?.icon}/> <span style={{marginLeft: 5}}>{data?.metadata?.name}</span>
    </div>
}
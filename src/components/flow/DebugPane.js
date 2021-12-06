import DebugDetails from "./DebugDetails";
import React from "react";
import "./DebugPane.css";

export default function DebugPane({elements, currentNode, onDetails}) {

    return <div className="DebugPane">
        <div className="ResizeHorizontalHandler"></div>
        <DebugDetails
                nodes={elements}
                node={currentNode}
                onConnectionDetails={onDetails}
        />
    </div>
}
import React from "react";
import './DebugDetails.css';
import convertNodesToProfilingData from "./profilingConverter";
import {FlowProfiling} from "./FlowProfiling";

const DebugDetails = ({nodes, node, onConnectionDetails}) => {

    return <section className="DebugDetails">
        <div className="DebugContent">
            <FlowProfiling
                profilingData={convertNodesToProfilingData(nodes)}
                node={node}
                onCallSelect={(nodeId, edgeId) => {
                    if(onConnectionDetails) {
                        onConnectionDetails(nodeId, edgeId)
                    }
                }}
            />
        </div>
    </section>
}

export default DebugDetails;
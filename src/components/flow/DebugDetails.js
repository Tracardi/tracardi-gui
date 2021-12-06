import React from "react";
import './DebugDetails.css';
import convertNodesToProfilingData from "./profilingConverter";
import {MemoFlowProfiling} from "./FlowProfiling";

const DebugDetails = ({nodes, nodeId, edgeId, onConnectionDetails}) => {

    return <section className="DebugDetails">
            <MemoFlowProfiling
                profilingData={convertNodesToProfilingData(nodes)}
                nodeId={nodeId}
                edgeId={edgeId}
                onCallSelect={(nodeId, edgeId) => {
                    if(onConnectionDetails) {
                        onConnectionDetails(nodeId, edgeId)
                    }
                }}
            />
    </section>
}

export default DebugDetails;
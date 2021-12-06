import React from "react";
import './DebugDetails.css';
import {FlowProfiling} from "./FlowProfiling";

const DebugDetails = ({profilingData, onConnectionDetails}) => {

    return <section className="DebugDetails">
            <FlowProfiling
                profilingData={profilingData}
                onCallSelect={(nodeId, edgeId) => {
                    if(onConnectionDetails) {
                        onConnectionDetails(nodeId, edgeId)
                    }
                }}
            />
    </section>
}

export default DebugDetails;
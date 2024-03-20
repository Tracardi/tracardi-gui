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
                orientation="vertical"
            />
    </section>
}

export default DebugDetails;
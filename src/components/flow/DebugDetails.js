import React from "react";
import './DebugDetails.css';
import convertNodesToProfilingData from "./profilingConverter";
import {FlowProfiling} from "./FlowProfiling";
import {HighlightOff} from "@material-ui/icons";

const DebugDetails = ({nodes, node, onConnectionDetails, onClose}) => {

    const handleClose = () => {
        if(onClose) {
            onClose()
        }
    }

    return <section className="DebugDetails">
        <div className="DebugTitle">
            Debugging
            <HighlightOff onClick={handleClose} style={{cursor: "pointer"}}/>
        </div>
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
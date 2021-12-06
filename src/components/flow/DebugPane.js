import DebugDetails from "./DebugDetails";
import React, {useState} from "react";
import "./DebugPane.css";
import IconButton from "../elements/misc/IconButton";
import {VscDebugAlt} from "@react-icons/all-files/vsc/VscDebugAlt";
import {VscRunErrors} from "react-icons/vsc";
import FlowLogs from "./FlowLogs";

export default function DebugPane({elements, nodeId, edgeId, logs, onDetails}) {

    const [displayDebug, setDisplayDebug] = useState(true);
    const [displayLog, setDisplayLog] = useState(false);

    const handleDisplayDebug = () => {
        setDisplayDebug(true);
        setDisplayLog(false);
    }

    const handleDisplayLog = () => {
        setDisplayDebug(false);
        setDisplayLog(true);
    }

    const DebugToggler = () => {
        if(displayDebug) {
            return <DebugDetails
                nodes={elements}
                nodeId={nodeId}
                edgeId={edgeId}
                onConnectionDetails={onDetails}
            />
        }

        if(displayLog) {
            return <FlowLogs logs={logs}/>
        }

        return ""
    }

    return <div className="DebugPane">
        <div className="ResizeHorizontalHandler"></div>
        <div className="WorkArea">
            <div className="Icons">
                <IconButton label="Debug" onClick={handleDisplayDebug}>
                    <VscDebugAlt size={20}/>
                </IconButton>
                <IconButton label="Logs" onClick={handleDisplayLog}>
                    <VscRunErrors size={24}/>
                </IconButton>
            </div>
            <DebugToggler/>
        </div>

    </div>
}
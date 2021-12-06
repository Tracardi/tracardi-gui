import DebugDetails from "./DebugDetails";
import React, {useState} from "react";
import "./DebugPane.css";
import IconButton from "../elements/misc/IconButton";
import {VscDebugAlt} from "react-icons/vsc";
import {VscRunErrors} from "react-icons/vsc";
import FlowLogs from "./FlowLogs";

function DebugPane({profilingData, logs, onDetails}) {

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
                profilingData={profilingData}
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
                    <VscDebugAlt size={24}/>
                </IconButton>
                <IconButton label="Logs" onClick={handleDisplayLog}>
                    <VscRunErrors size={24}/>
                </IconButton>
            </div>
            <DebugToggler/>
        </div>

    </div>
}

export const MemoDebugPane = React.memo(DebugPane,
    (prevProps, nextProps) => {
        console.log("MemoDebugPane",prevProps.profilingData === nextProps.profilingData)
        return prevProps.profilingData === nextProps.profilingData;
    });
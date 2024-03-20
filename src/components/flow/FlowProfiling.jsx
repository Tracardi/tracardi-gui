import React, {useState} from "react";
import './FlowProfiling.css';
import DebugBox from "./DebugBox";

export function FlowProfiling({profilingData, flow, onCallSelect, orientation="vertical"}) {

    const [currentNode, setCurrentNode] = useState(null);

    const sort = (profilingData) => {

        const compare = (a, b) => {
            if (a.startTime < b.startTime) {
                return -1;
            }
            if (a.startTime > b.startTime) {
                return 1;
            }
            return 0;
        }

        profilingData.calls.sort(compare)

        return profilingData
    }

    const maxTime = (profilingData) => {

        let calls = profilingData.calls.map((call) => {
            return call.endTime
        })

        return Math.max(...calls);
    }

    const handleClick = (debugProfile) => {
        setCurrentNode(debugProfile)
        if (onCallSelect) {
            onCallSelect(
                debugProfile?.id,
                debugProfile?.call?.input?.edge?.id
            )
        }
    }

    const Row = ({sq, error, name, runTime, relativeRunTime, children, highlighed = false, currentCall = false, onClick}) => {

        let rowClass = (highlighed === true) ? "TaskRow HighRow " : "TaskRow";
        rowClass = currentCall ? "TaskRow CurrentCall" : rowClass;

        const exNo = (error === true) ? <span className="FailStatus">{sq}</span> :
            <span className="OKStatus">{sq}</span>

        return <div className={rowClass} onClick={onClick}>
            <div className="TaskSq">{(sq) ? exNo : "No."}</div>
            <div className="TaskName">{name}</div>
            <div className="TaskRunTime" title={relativeRunTime}>{runTime}</div>
            <div className="TaskBar">
                {children}
            </div>
        </div>
    }

    const Rows = ({profilingData}) => {
        if (profilingData && Array.isArray(profilingData.calls)) {
            const wholeTime = maxTime(profilingData) * 1.1;

            return sort(profilingData).calls.map((obj, index) => {
                    const relativeStartTime = (obj.startTime / wholeTime) * 100;
                    const _relativeRunTime = (obj.runTime / wholeTime) * 100;
                    const relativeRunTime = (_relativeRunTime < 2) ? 2 : _relativeRunTime;

                    return <Row name={obj.name}
                                sq={obj.sq}
                                error={obj.error}
                                runTime={(obj.runTime * 1000).toFixed(2) + 'ms'}
                                relativeRunTime={obj.runTime.toFixed(3) + " from " + wholeTime.toFixed(2) +
                                " makes " + relativeRunTime.toFixed(1) + "%"}
                                currentCall={isCurrentCall(obj)}
                                onClick={() => handleClick(obj)}
                                key={index}
                    >
                        <div
                            title={obj.runTime}
                            className="Task"
                            style={{
                                left: relativeStartTime + "%",
                                minWidth: relativeRunTime + "%"
                            }}>
                            <div
                                className="TaskBall"
                                title={obj.startTime}
                            />
                            <div
                                className="TaskBall"
                                title={obj.endTime}
                            />
                        </div>
                    </Row>
                }
            )
        }

        return ""

    }

    const isCurrentCall = (obj) => {
        return currentNode?.id === obj.id && currentNode?.call?.input?.edge?.id === obj?.call?.input?.edge?.id;
    }

    const flexDirection = (orientation === "vertical") ? "row": "column"

    return <div className="DebugAndProfile" style={{flexDirection: flexDirection}}>
        {orientation !== "vertical" && <h1 style={{fontWeight: 300, borderBottom: "solid #ccc 1px"}}>Flow: {flow?.name}</h1>}
        <div className="Profiling">
            <div className="TaskHeader">
                <div className="TaskSq">&nbsp;</div>
                <div className="TaskName">Actions</div>
                <div className="TaskRunTime">Run time</div>
                <div className="TaskBar">Execution time span</div>
            </div>
            <div className="TaskRows">
                <Rows profilingData={profilingData}/>
            </div>

        </div>
        <div className="Debugging">
            {currentNode && <DebugBox call={currentNode?.call}/>}
        </div>
    </div>
}

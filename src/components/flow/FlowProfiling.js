import React, {useState} from "react";
import './FlowProfiling.css';
import DebugBox from "./DebugBox";

export function FlowProfiling({profilingData, node, onCallSelect}) {

    const [currentCall, setCurrentCall] = useState(null);


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
        setCurrentCall(debugProfile)
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
                                highlighed={node && node.id === obj.id}
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
                            ></div>
                            <div
                                className="TaskBall"
                                title={obj.endTime}
                            ></div>
                        </div>
                    </Row>
                }
            )
        }

        return ""

    }

    const isCurrentCall = (obj) => {
        return currentCall && currentCall.id === obj.id && currentCall.call.input.edge === obj.call.input.edge;
    }

    return <div className="DebugAndProfile">
        <div className="Profiling">
            <div className="TaskHeader" style={{zIndex: 3, height: 56}}>
                <div className="TaskSq">&nbsp;</div>
                <div className="TaskName">Actions</div>
                <div className="TaskRunTime">Run time</div>
                <div className="TaskBar">Execution time span</div>
            </div>
            <div style={{height: "inherit", overflowY: "auto"}}>
                <Rows profilingData={profilingData}/>
            </div>

        </div>
        <div className="Debugging">
            {currentCall && <DebugBox call={currentCall?.call}/>}
        </div>
    </div>
}
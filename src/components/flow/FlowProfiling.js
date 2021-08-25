import React, {useState} from "react";
import './FlowProfiling.css';
import DebugBox from "./DebugBox";

export function FlowProfiling({profilingData, node, onCallSelect}) {

    const [currentCall, setCurrentCall] = useState(null);

    const compare = (a, b) => {
        if (a.startTime < b.startTime) {
            return -1;
        }
        if (a.startTime > b.startTime) {
            return 1;
        }
        return 0;
    }

    const convert = (profilingData) => {

        let calls = profilingData.calls.map((call) => {
            return call.endTime
        })

        profilingData.endTime = Math.max(...calls);
        profilingData.calls.sort(compare)

        return profilingData;
    }

    const handleClick = (debugProfile) => {
        setCurrentCall(debugProfile)
        if(onCallSelect) {
            onCallSelect(
                debugProfile?.id,
                debugProfile?.call?.input?.edge?.id
            )
        }
    }

    const Row = ({sq, error, name, runTime, children, highlighed = false, currentCall = false, onClick}) => {

        let rowClass = (highlighed === true) ? "TaskRow HighRow " : "TaskRow";
        rowClass = currentCall ? "TaskRow CurrentCall" : rowClass;

        const exNo = (error === true) ? <span className="FailStatus">{sq}</span> :
            <span className="OKStatus">{sq}</span>

        return <div className={rowClass} onClick={onClick}>
            <div className="TaskSq">{(sq) ? exNo : "No."}</div>
            <div className="TaskName">{name}</div>
            <div className="TaskRunTime">{runTime}</div>
            <div className="TaskBar">
                {children}
            </div>
        </div>
    }

    const Rows = ({profilingData}) => {
        if(profilingData && Array.isArray(profilingData.calls)) {
            const wholeTime = profilingData.endTime * 1.1;
            return convert(profilingData).calls.map((obj, index) => {
                    const relativeStartTime = (obj.startTime / wholeTime) * 100;
                    const _relativeRunTime = (obj.runTime / wholeTime) * 100;
                    const relativeRunTime = (_relativeRunTime<2) ? 2 :  _relativeRunTime;

                    return <Row name={obj.name}
                                sq={obj.sq}
                                error={obj.error}
                                runTime={obj.runTime.toFixed(3) + 's'}
                                highlighed={node && node.id === obj.id}
                                currentCall={isCurrentCall(obj)}
                                onClick={() => handleClick(obj)}
                                key={index}
                    >
                        <div
                            title={obj.runTime}
                            className="Task"
                            key={index}
                            style={{
                                left: relativeStartTime + "%",
                                width: relativeRunTime + "%"
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
            <div style={{width: 960, padding: 6}}>
                <div className="TaskHeader" style={{position: "sticky", top: 0, zIndex: 3}}>
                    <div className="TaskSq">&nbsp;</div>
                    <div className="TaskName">Action</div>
                    <div className="TaskRunTime">Run time</div>
                    <div className="TaskBar">Profiling</div>
                </div>
                <Rows profilingData={profilingData}/>
            </div>

        </div>

        {currentCall && <div className="Debugging"><DebugBox call={currentCall?.call}/></div>}
    </div>
}
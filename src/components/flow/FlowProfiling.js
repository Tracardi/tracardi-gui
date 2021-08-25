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
        console.log("xxx1",profilingData)
        let calls = profilingData.calls.map((call) => {
            return call.endTime
        })

        const maxTime = Math.max(...calls);
        profilingData.endTime = maxTime
        profilingData.calls.sort(compare)
        console.log("xxx2",profilingData)

        // profilingData.calls = profilingData.calls.map((obj) => {
        //     return {
        //         ...obj,
        //         // runTime: obj.runTime.toFixed(3),
        //         // startTime: obj.startTime.toFixed(3),
        //         // endTime: obj.endTime.toFixed(3),
        //         relativeStartTime: (obj.startTime / extTime) * 100,
        //         relativeEndTime: (obj.endTime / extTime) * 100,
        //         relativeRunTime: (obj.runTime / extTime) * 100
        //     }
        // })

        return profilingData;
    }

    const handleClick = (debugProfile) => {
        // console.log("debugProfile", debugProfile)
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
        const wholeTime = profilingData.endTime * 1.1;
        return profilingData && convert(profilingData).calls.map((obj, index) => {

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

    const isCurrentCall = (obj) => {
        return currentCall && currentCall.id === obj.id && currentCall.call.input.edge === obj.call.input.edge;
    }

    return <div className="DebugAndProfile">
        <div className="Profiling">
            <div style={{width: 1000, margin: 10}}>
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
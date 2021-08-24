import React from "react";
import './FlowProfiling.css';

export function FlowProfiling({profilingData, node}) {

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

        const maxTime = Math.max(...calls);
        profilingData.endTime = maxTime
        profilingData.calls.sort(compare)
        const extTime = maxTime * 1.1

        profilingData.calls.map((obj) => {
            obj.absoluteRunTime = obj.runTime.toFixed(3)
            obj.absoluteStartTime = obj.startTime.toFixed(3)
            obj.absoluteEndTime = obj.endTime.toFixed(3)
            obj.startTime = (obj.startTime / extTime) * 100
            obj.endTime = (obj.endTime / extTime) * 100
            obj.runTime = (obj.runTime / extTime) * 100
            return null;
        })

        return profilingData;
    }


    const Row = ({sq, error, name, runTime, children, highlighed}) => {

        const rowClass = (highlighed === true) ? "TaskRow HighRow " : "TaskRow";
        const exNo = (error===true) ? <span className="FailStatus">{sq}</span> : <span className="OKStatus">{sq}</span>

        return <div className={rowClass}>
            <div className="TaskSq">{(sq) ? exNo : "No."}</div>
            <div className="TaskName">{name}</div>
            <div className="TaskRunTime">{runTime}</div>
            <div className="TaskBar">
                {children}
            </div>
        </div>
    }

    return <div className="Profiling">
        <div style={{width: 1000, margin: 10}}>
            <Row name="Action" runTime="Time">Profiling</Row>
            {
                profilingData && convert(profilingData).calls.map((obj, index) => {
                        return <Row name={obj.name}
                                    sq={obj.sq}
                                    error={obj.error}
                                    runTime={obj.absoluteRunTime.toString() + 's'}
                                    highlighed={node && node.id === obj.id}
                        >

                            <div
                                title={obj.runTime}
                                className="Task"
                                key={index}
                                style={{
                                    left: obj.startTime + "%",
                                    width: obj.runTime + "%"
                                }}>
                                <div
                                    className="TaskBall"
                                    title={obj.absoluteStartTime}
                                ></div>
                                <div
                                    className="TaskBall"
                                    title={obj.absoluteEndTime}
                                ></div>

                            </div>

                        </Row>
                    }
                )
            }
        </div>

    </div>
}
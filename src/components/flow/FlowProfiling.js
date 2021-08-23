import React from "react";
import './FlowProfiling.css';
import {isNode} from "react-flow-renderer";

export function FlowProfiling({nodes, node}) {

    const compare = (a, b) => {
        if (a.startTime < b.startTime) {
            return -1;
        }
        if (a.startTime > b.startTime) {
            return 1;
        }
        return 0;
    }

    let profilingData = {
        startTime: 0,
        endTime: 0,
        calls: []
    }

    nodes.map((node) => {
        if (isNode(node)) {
            if (node.data?.debugging?.node?.calls) {
                node.data?.debugging?.node?.calls.map((call) => {
                    if (call.run === true) {
                        profilingData.calls.push(
                            {
                                id: node.id,
                                sq: node.data?.debugging?.node?.executionNumber,
                                error: call.error !== null,
                                name: node.data?.debugging?.node?.name,
                                startTime: call.profiler.startTime,
                                runTime: call.profiler.runTime,
                                endTime: call.profiler.endTime
                            }
                        )
                    }

                    return null;
                })
            }
        }
        return null;
    });

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
                profilingData.calls.map((obj, index) => {
                        return <Row name={obj.name}
                                    sq={obj.sq}
                                    error={obj.error}
                                    runTime={obj.absoluteRunTime.toString() + 's'}
                                    highlighed={node.id === obj.id}
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
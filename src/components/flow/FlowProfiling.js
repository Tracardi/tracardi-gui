import React from "react";
import './FlowProfiling.css';

export function FlowProfiling() {

    const profilingData = {
        startTime: 0,
        endTime: 15,
        calls:[
            {
                name: "node1",
                startTime: 0,
                runTime: 10,
                endTime: 10
            },
            {
                name: "node2",
                startTime: 5,
                runTime: 10,
                endTime: 15
            },
            {
                name: "node3",
                startTime: 10,
                runTime: 2,
                endTime: 12
            },
            {
                name: "node4",
                startTime: 2,
                runTime: 1,
                endTime: 4
            }
        ]
    }

    function compare(a, b) {
        if ( a.startTime < b.startTime ){
            return -1;
        }
        if ( a.startTime > b.startTime ){
            return 1;
        }
        return 0;
    }

    profilingData.calls.sort(compare)

    const maxTime = profilingData.endTime

    profilingData.calls.map((obj)=>{
        obj.startTime = (obj.startTime/maxTime)*100
        obj.endTime = (obj.endTime/maxTime)*100
        obj.runTime = (obj.runTime/maxTime)*100
    })

    console.log(profilingData)

    return <div className="Profiling">
        {
            profilingData.calls.map((obj, index) => {
                return <div className="TaskRow">
                    <div className="TaskName">{obj.name}</div>
                    <div className="TaskRunTime">
                        <div
                            title={obj.runTime}
                            className="Task"
                            key={index} style={{
                            left: obj.startTime + "%",
                            width: obj.runTime + "%"}}></div>
                    </div>
                </div>
                }
            )
        }
    </div>
}
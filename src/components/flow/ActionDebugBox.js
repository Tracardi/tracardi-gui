import "./ActionDebugBox.css";
import React, {useEffect, useState} from "react";
import JsonStringify from "../elements/misc/JsonStingify";
import {ObjectInspector} from "react-inspector";

export function NoData() {
    return "Port has no data. It means that with provided payload this port will not execute."
}

function DebugPortDetails({port}) {
    function render() {
        return <div>
            <div className="PortName">Port: {port.port}</div>
            <div style={{margin: 5}}>
                {port.value && <JsonStringify data={port.value} unfold={false}/>}
                {!port.value && <NoData/>}
            </div>
        </div>
    };

    if(!port.port) {
        return "Please click on port to view its data."
    }
    return render()
}

function DebugBox({call}) {

    const [portValue, setPortValue] = useState(null);

    useEffect(() => {
        setPortValue({})
    }, [call])

    const onPortClick = (value) => {
        setPortValue(value)
    }

    const renderPorts = (messages) => {
        if (messages) {
            return messages.map((message, index) => {
                return <div className="Details" key={index}>
                    <div className="PortName" onClick={() => onPortClick(message)}>{message.port}</div>
                </div>
            })
        }
    }

    return <>
        <div className="DebugBox">
            <div className="Ports">
                <div className="ActionInputs">
                    {call.input && renderPorts([call.input])}
                </div>
                <div className="ActionOutputs">
                    {call.output && call.output.length > 0 && renderPorts(call.output)}
                </div>
            </div>
        </div>
        <div className="DebugDataBox">
            {portValue && <DebugPortDetails port={portValue}/>}
        </div>
    </>
}

export default function ActionDebugBox({calls}) {

    const renderActions = (calls) => {
        if (calls && Array.isArray(calls)) {
            return calls.map((call, index) => {
                return <div key={index}>
                    <div className="EdgeId">Connection: {call.edge ? call.edge.id : "None"}</div>
                    {call.error && <div className="Errors">{call.error}</div>}
                    {!call.error && <div className="ActionDebugBox">
                        <DebugBox call={call}/>
                        {/*<ObjectInspector data={calls}/>*/}
                    </div>}
                </div>
            });
        }
        return <NoData/>
    }

    return renderActions(calls)
}
import React, { memo } from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";

export default memo (({data}) => {

    const renderOutputs = (spec) => {
        if(spec?.outputs) {
            return <div className="NodePorts" style={{bottom: "-10px"}}>
                {
                    spec.outputs.map((value, index)=>{
                        return <Handle
                            key={index}
                            type="source"
                            position="bottom"
                            id={value}
                            style={{position: "unset"}}
                        />
                    })
                }
            </div>
        }
    }

    const renderInputs = (spec) => {
        if(spec?.inputs) {
            return <div className="NodePorts" style={{top: "-8px"}}>
                {
                    spec.inputs.map((value, index)=>{
                        return <Handle
                            key={index}
                            type="target"
                            position="top"
                            id={value}
                            style={{position: "unset"}}
                        />
                    })
                }
            </div>
        }
    }

    const SequenceNumber = ({data}) => {

        const hasError = (calls) => {
            if(Array.isArray(calls)) {
                return calls.some((call) => call.error !== null)
            }
            return false
        }

        if(data.debugging?.node?.sequenceNumber) {
            let status = hasError(data.debugging?.node?.calls) ? " Error": " Ok"
            return <div className={"SequenceNumber" + status}>{data.debugging.node.sequenceNumber}</div>
        } else {
            return ""
        }
    }

    return (
        <>
            <SequenceNumber data={data}/>
            {renderInputs(data?.spec)}
            <div className="NodePanel">
                <div className="NodeIcon"><FlowNodeIcons icon={data?.metadata?.icon}/></div>
                <div className="NodeLabel" style={{maxWidth: data?.metadata?.width, maxHeight: data?.metadata?.height}}>
                    {data?.metadata?.name}
                </div>
            </div>

            {renderOutputs(data?.spec)}
        </>
    );
});

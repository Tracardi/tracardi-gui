import React, { memo } from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import ExecutionNumber from "./ExecutionNumber";

export default memo (({data}) => {

    const renderOutputs = (spec) => {
        if(spec?.outputs) {
            return <div className="NodePorts" style={{bottom: "-5px"}}>
                {
                    spec.outputs.map((value, index)=>{
                        return <Handle
                            key={index}
                            type="source"
                            position="bottom"
                            id={value}
                        />
                    })
                }
            </div>
        }
    }

    const renderInputs = (spec) => {
        if(spec?.inputs) {
            return <div className="NodePorts" style={{top: "-5px"}}>
                {
                    spec.inputs.map((value, index)=>{
                        return <Handle
                            key={index}
                            type="target"
                            position="top"
                            id={value}
                        />
                    })
                }
            </div>
        }
    }

    return (
        <>
            <ExecutionNumber data={data}/>
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

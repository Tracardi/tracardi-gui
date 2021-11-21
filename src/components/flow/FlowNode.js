import React, {memo, useState} from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import ExecutionNumber from "./ExecutionNumber";

export default memo(({data}) => {

    const InputPort = ({value}) => {
        const [showHint, setShowHint] = useState(false);
        return <div className="NodePortContainer">
            {showHint && <span id={value} className="InputPortHint PortHint">{value}</span>}
            <Handle
                type="target"
                position="top"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => setShowHint(false)}
            />

        </div>
    }

    const OutputPort = ({value}) => {
        const [showHint, setShowHint] = useState(false);
        return <div className="NodePortContainer">
            <Handle
                type="source"
                position="bottom"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => setShowHint(false)}
            />
            {showHint && <span id={value} className="OutputPortHint PortHint">{value}</span>}
        </div>
    }

    const Outputs = ({spec}) => {

        if (spec?.outputs) {
            return <div className="NodePorts" style={{marginTop: "-7px"}}>
                {
                    spec.outputs.map((value, index) => {
                        return <OutputPort key={index} value={value}/>
                    })
                }
            </div>
        }
    }

    const Inputs = ({spec}) => {
        if (spec?.inputs) {
            return <div className="NodePorts" style={{marginBottom: "-7px"}}>
                {
                    spec.inputs.map((value, index) => {
                        return <InputPort key={index} value={value} />
                    })
                }
            </div>
        }
    }

    const nodeClass = (data?.metadata?.selected === true) ? "NodePanel DebugNode" : "NodePanel"

    return (
        <>
            <ExecutionNumber data={data}/>
            <Inputs spec={data?.spec}/>
            <div className={nodeClass}>
                <div className="NodePadding">
                    <div className="NodeIcon"><FlowNodeIcons icon={data?.metadata?.icon}/></div>
                    <div className="NodeLabel"
                         style={{maxWidth: data?.metadata?.width, maxHeight: data?.metadata?.height}}>
                        <p>{data?.metadata?.name}</p>
                        <aside>v.{data?.spec?.version}</aside>
                    </div>
                </div>
                {data?.metadata?.pro ? <div className="NodePro">Pro</div> : ""}
            </div>
            <Outputs spec={data?.spec}/>
        </>
    );
});

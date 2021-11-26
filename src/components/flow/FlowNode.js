import React, {memo, useState} from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import ExecutionNumber from "./ExecutionNumber";
import {isObject} from '../../misc/typeChecking';


export default memo(({data}) => {

    const InputPort = ({value, doc}) => {

        const [showHint, setShowHint] = useState(false);
        const [showDesc, setShowDesc] = useState(false);

        return <div className="NodePortContainer">
            {showHint && <span className="InputPortHint PortHint">{value}</span> }
            {showDesc && doc && <span className="InputPortDesc PortHint">{doc}</span>}

            <Handle
                type="target"
                position="top"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => {setShowHint(false); setShowDesc(false);}}
                onClick={()=>{setShowDesc(true)}}
            />

        </div>
    }

    const OutputPort = ({value, doc}) => {

        const [showHint, setShowHint] = useState(false);
        const [showDesc, setShowDesc] = useState(false);

        return <>
          <div className="NodePortContainer">
            <Handle
                type="source"
                position="bottom"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => {setShowHint(false); setShowDesc(false);}}
                onClick={()=>{setShowDesc(true)}}
            />
            {showHint && <span className="OutputPortHint PortHint">{value}</span>}
            {showDesc && doc && <span className="OutputPortDesc PortHint">{doc}</span>}
        </div>

        </>
    }

    const Outputs = ({spec, documentation}) => {

        if (spec?.outputs) {
            return <div className="NodePorts" style={{marginTop: "-7px"}}>
                {
                    spec.outputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <OutputPort key={index} value={value} doc={doc}/>
                    })
                }
            </div>
        }
    }

    const Inputs = ({spec, documentation}) => {
        if (spec?.inputs) {
            return <div className="NodePorts" style={{marginBottom: "-7px"}}>
                {
                    spec.inputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <InputPort key={index} value={value} doc={doc}/>
                    })
                }
            </div>
        }
    }

    const nodeClass = (data?.metadata?.selected === true) ? "NodePanel DebugNode" : "NodePanel"

    return (
        <div style={{position: "relative"}}>
            <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs}/>
            <div className={nodeClass}>
                <ExecutionNumber data={data}/>
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
            <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs}/>
        </div>
    );
});

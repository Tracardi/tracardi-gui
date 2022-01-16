import React, {useState} from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import ExecutionNumber from "./ExecutionNumber";
import {isObject} from '../../misc/typeChecking';
import {objectMap} from "../../misc/mappers";


const FlowNodeWithEventsDynamic = ({data}) => {

    const InputPort = ({value, doc, style}) => {

        const [showHint, setShowHint] = useState(false);
        const [showDesc, setShowDesc] = useState(false);

        return <div className="NodePortContainer">
            {showHint && <span className="InputPortHint PortHint">{value}</span> }
            {showDesc && doc && <span className="InputPortDesc PortHint">{doc}</span>}

            <Handle
                style={style}
                type="target"
                position="top"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => {setShowHint(false); setShowDesc(false);}}
                onClick={()=>{setShowDesc(true)}}
            />

        </div>
    }

    const OutputPort = ({value, doc, style}) => {

        const [showHint, setShowHint] = useState(false);
        const [showDesc, setShowDesc] = useState(false);

        return <>
          <div className="NodePortContainer">
            <Handle
                style={style}
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

    const Outputs = ({spec, documentation, style}) => {

        if (spec?.outputs) {
            return <div className="NodePorts" style={{marginTop: "-7px"}}>
                {
                    spec.outputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <OutputPort key={index} value={value} doc={doc} style={style}/>
                    })
                }
            </div>
        }
        return "Error no spec"
    }

    const Inputs = ({spec, documentation, style}) => {
        if (spec?.inputs) {
            return <div className="NodePorts" style={{marginBottom: "-7px"}}>
                {
                    spec.inputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <InputPort key={index} value={value} doc={doc} style={style}/>
                    })
                }
            </div>
        }
        return "Error no spec"
    }

    const nodeClass = (data?.metadata?.selected === true) ? "NodePanel DebugNode" : "NodePanel"
    const nodeStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {borderColor: "#ccc", color: "#999"} : {}
    const portStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {borderColor: "#ccc"} : {borderColor: "#1565c0", borderWidth: 2}
    const backgroundStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {backgroundColor: "#aaa"} : {}

    return (
        <div style={{position: "relative"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <div>
                    <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs} style={portStyle}/>
                    <div className={nodeClass} style={nodeStyle}>
                        <ExecutionNumber data={data}/>
                        <div className="NodePadding">
                            <div className="NodeIcon"><FlowNodeIcons icon={data?.metadata?.icon}/></div>
                            <div className="NodeLabel"
                                 style={{maxWidth: data?.metadata?.width, maxHeight: data?.metadata?.height}}>
                                <p>{data?.metadata?.name}</p>
                                <aside>v.{data?.spec?.version}</aside>
                            </div>
                        </div>
                        {data?.metadata?.pro ? <div className="NodePro" style={backgroundStyle}>Pro</div> : ""}
                    </div>
                    <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs} style={portStyle}/>
                </div>
                {isObject(data?.metadata?.emits_event) && <div className="NodeEvents">
                    {objectMap(data?.metadata?.emits_event,(name, eventType)  => <span className="Event">{name}</span>)}
                </div>}

            </div>
        </div>
    );
};

const FlowNodeWithEvents = React.memo(FlowNodeWithEventsDynamic);
export default FlowNodeWithEvents;
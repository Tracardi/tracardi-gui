import React, {useState} from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import ThresholdIcon from "./ThresholdIcon";
import {BsPlayCircleFill} from "react-icons/bs";
import {isObject} from "../../misc/typeChecking";
import ExecutionNumber from "./ExecutionNumber";


const StartNodeDynamic = ({data}) => {

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

    const nodeClass = (data?.metadata?.selected === true) ? "StartNode DebugNode" : "StartNode"
    const nodeStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {borderColor: "#ccc", color: "#999"} : {}
    const portStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {borderColor: "#ccc"} : {borderColor: "#1565c0", borderWidth: 2}

    return (
        <div style={{position: "relative"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                {Array.isArray(data?.spec?.init?.events) && <div className="NodeInboundEvents">
                    {data?.spec?.init?.events.map((eventObj, idx)  => <span className="Event" key={idx}>{eventObj.name}</span>)}
                </div>}
                <div>
                    {data?.spec?.run_once?.enabled && <ThresholdIcon/>}
                    <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs} style={portStyle}/>

                    <div className={nodeClass} style={nodeStyle}>
                        <ExecutionNumber data={data} style={{top: 9, right: -16}}/>
                        <div className="NodePadding">
                            <BsPlayCircleFill size={24} style={{margin: 10}}/>
                        </div>
                    </div>
                    <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs} style={portStyle}/>
                </div>
            </div>
        </div>
    );
};

const StartNode = React.memo(StartNodeDynamic);
export default StartNode;
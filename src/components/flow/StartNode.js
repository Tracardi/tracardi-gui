import React, {useState} from 'react';
import {Handle} from 'reactflow';
import './FlowNode.css';
import ThresholdIcon from "./ThresholdIcon";
import {isObject} from "../../misc/typeChecking";
import {ExecutionSeqNumber} from "./NodeAlerts";
import FlowNodeIcons from "./FlowNodeIcons";


const StartNodeDynamic = ({data}) => {

    const InputPort = ({value, doc, style}) => {

        const [showHint, setShowHint] = useState(false);
        const [showDesc, setShowDesc] = useState(false);

        return <div className="NodePortContainer">
            {showHint && <span className="InputPortHint PortHint">{value}</span>}
            {showDesc && doc && <span className="InputPortDesc PortHint">{doc}</span>}

            <Handle
                style={style}
                type="target"
                position="top"
                id={value}
                onMouseOver={() => setShowHint(true)}
                onMouseOut={() => {
                    setShowHint(false);
                    setShowDesc(false);
                }}
                onClick={() => {
                    setShowDesc(true)
                }}
            />

        </div>
    }

    const Inputs = ({spec, documentation, style}) => {
        if (spec?.inputs) {
            return <div className="NodePorts" style={{marginBottom: "-10px"}}>
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
                    onMouseOut={() => {
                        setShowHint(false);
                        setShowDesc(false);
                    }}
                    onClick={() => {
                        setShowDesc(true)
                    }}
                />
                {showHint && <span className="OutputPortHint PortHint">{value}</span>}
                {showDesc && doc && <span className="OutputPortDesc PortHint">{doc}</span>}
            </div>

        </>
    }

    const Outputs = ({spec, documentation, style}) => {

        if (spec?.outputs) {
            return <div className="NodePorts" style={{marginTop: "-10px"}}>
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
    const nodeStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true) ? {
        borderColor: "#ccc",
        color: "#999"
    } : {}
    const portStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true) ? {borderColor: "#ccc"} : {
        borderColor: "#1565c0",
        borderWidth: 2
    }

    return (
        <div className="CondContainer">
            {data?.spec?.run_once?.enabled && <ThresholdIcon style={{left: -10}}/>}
            <div className="RightPlaceholder">
                {Array.isArray(data?.spec?.init?.event_types) && <div className="NodeInboundEvents">
                    {data?.spec?.init?.event_types.map((eventObj, idx) => <span className="Event"
                                                                                key={idx}>{eventObj.name}</span>)}
                </div>}
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <div>
                    <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs} style={portStyle}/>

                    <div className={nodeClass} style={nodeStyle}>
                        <ExecutionSeqNumber data={data} style={{top: 13, right: -9}}/>
                        <div className="NodePadding" style={{padding: 10}}>
                            <FlowNodeIcons icon={data?.metadata?.icon} size={24}/>
                        </div>
                    </div>
                    <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs}
                             style={portStyle}/>
                </div>
            </div>
            <div className="LeftPlaceholder">
                <div className="CondTitle">{data?.metadata?.name}</div>
            </div>
        </div>
    );
};

const StartNode = React.memo(StartNodeDynamic);
export default StartNode;
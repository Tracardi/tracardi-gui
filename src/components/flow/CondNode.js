import React, {useState} from 'react';
import {Handle} from 'react-flow-renderer';
import './FlowNode.css';
import ThresholdIcon from "./ThresholdIcon";
import {isObject} from "../../misc/typeChecking";
import {ErrorNumber, ExecutionSeqNumber, WarningNumber} from "./NodeAlerts";
import FlowNodeIcons from "./FlowNodeIcons";


const CondNodeDynamic = ({data}) => {

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
            return <div className="CondNodePorts" style={{marginTop: "-7px", position: "relative"}}>
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

    const nodeClass = (data?.metadata?.selected === true) ? "CondNode DebugNode" : "CondNode"
    const nodeStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true) ? {
        borderColor: "#ccc",
        color: "#999"
    } : {}
    const portStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true) ? {borderColor: "#ccc"} : {
        borderColor: "#1565c0",
        borderWidth: 2
    }

    return (
        <div className="CondContainer" style={{gap: 10}}>
            {data?.spec?.run_once?.enabled && <ThresholdIcon style={{left: "-50%"}}/>}
            <div style={{display: "flex", alignItems: "center"}}>
                {Array.isArray(data?.spec?.init?.event_types) && <div className="NodeInboundEvents">
                    {data?.spec?.init?.event_types.map((eventObj, idx) => <span className="Event"
                                                                                key={idx}>{eventObj.name}</span>)}
                </div>}
                <div style={{position: "relative"}}>
                    {data?.debugging?.node?.warnings > 0 && data?.debugging?.node?.errors === 0 &&
                    <WarningNumber data={data}/>}
                    {data?.debugging?.node?.errors > 0 && <ErrorNumber data={data}/>}
                    <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs} style={portStyle}/>
                    <ExecutionSeqNumber data={data} style={{top: 21, right: -14, zIndex: 2}}/>
                    <div className={nodeClass} style={nodeStyle}>
                        <div className="NodePadding">
                            <span style={{transform: "rotate(45deg)"}}><FlowNodeIcons icon={data?.metadata?.icon}
                                                                                      size={24}/></span>
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

const CondNode = React.memo(CondNodeDynamic);
export default CondNode;
import React, {useState} from 'react';
import {Handle} from 'reactflow';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import {ErrorNumber, ExecutionSeqNumber, WarningNumber} from "./NodeAlerts";
import {isObject} from '../../misc/typeChecking';
import ThresholdIcon from "./ThresholdIcon";
import {BsArrowDownShort, BsCloud, BsStar} from "react-icons/bs";
import useTheme from "@mui/material/styles/useTheme";


const FlowNodeDynamic = ({data}) => {

    const theme = useTheme()

    const InputPort = ({value, doc, style, append}) => {

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
            >
                {append === true && <BsArrowDownShort size={20} style={{color: "#1565c0", pointerEvents: "none"}} className="nodrag target connectable"/>}
            </Handle>
        </div>
    }

    const OutputPort = ({value, doc, style, append}) => {

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
                >
                    {append === true && <BsArrowDownShort size={20} style={{color: "#1565c0", pointerEvents: "none"}} className="nodrag source connectable"/>}
                </Handle>
                {showHint && <span className="OutputPortHint PortHint">{value}</span>}
                {showDesc && doc && <span className="OutputPortDesc PortHint">{doc}</span>}
            </div>

        </>
    }

    const Outputs = ({spec, documentation, style, append}) => {

        if (spec?.outputs) {
            return <div className="NodePorts" style={{marginTop: "-9px"}}>
                {
                    spec.outputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <OutputPort key={index} value={value} doc={doc} style={style} append={append}/>
                    })
                }
            </div>
        }
        return "Error no spec"
    }

    const Inputs = ({spec, documentation, style, append}) => {
        if (spec?.inputs) {
            return <div className="NodePorts" style={{marginBottom: "-9px"}}>
                {
                    spec.inputs.map((value, index) => {
                        const doc = isObject(documentation) && value in documentation ? documentation[value].desc : null
                        return <InputPort key={index} value={value} doc={doc} style={style} append={append}/>
                    })
                }
            </div>
        }
        return "Error no spec"
    }

    let nodeClass = "NodePanel"
    nodeClass = (data?.metadata?.selected === true) ? nodeClass + " DebugNode" : nodeClass

    const nodeStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true)
        ? {
            borderColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground :  "#ccc",
            color: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedColor : "#999",
            backgroundColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.background,
        }
        : {
            borderColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.border,
            color: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedColor : theme.palette.wf.node.color,
            backgroundColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.background,
        }
    const portStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true)
        ? {
            borderColor: "#ccc",
            backgroundColor: theme.palette.common.white,
        }
        : {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.common.white,
            borderWidth: 2
        }

    const backgroundStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true) ? {backgroundColor: "#aaa"} : {}

    return (
        <div style={{position: "relative"}}>
            {data?.spec?.run_once?.enabled && <ThresholdIcon style={{width: "100%"}}/>}
            {data?.debugging?.node?.warnings > 0 && data?.debugging?.node?.errors === 0 && <WarningNumber
                data={data} style={{backgroundColor: theme.palette.background.default}}/>}
            {data?.debugging?.node?.errors > 0 && <ErrorNumber data={data}
                                                               style={{backgroundColor: theme.palette.background.default}}/>}
            <Inputs spec={data?.spec}
                    documentation={data?.metadata?.documentation?.inputs}
                    style={portStyle}
                    append={data?.spec?.append_input_payload}/>
            <div className={nodeClass} style={nodeStyle}>
                <ExecutionSeqNumber data={data}/>

                <div className="NodePadding">
                    <FlowNodeIcons icon={data?.metadata?.icon} size={20}/>
                    <div className="NodeLabel"
                         style={{maxWidth: data?.metadata?.width, maxHeight: data?.metadata?.height}}>
                        <p style={{marginLeft: 5}}>{data?.metadata?.name}</p>
                    </div>
                </div>
                {data?.metadata?.pro ? <div className="NodePro" style={backgroundStyle}><BsStar size={20} /></div> : ""}
                {data?.metadata?.remote ? <div className="NodePro" style={backgroundStyle}><BsCloud size={20} /></div> : ""}
            </div>
            <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs} style={portStyle}
                     append={data?.spec?.append_input_payload}/>
        </div>
    );
};

const FlowNode = React.memo(FlowNodeDynamic);
export default FlowNode;
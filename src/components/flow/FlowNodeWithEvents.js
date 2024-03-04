import React, {useState} from 'react';
import {Handle} from 'reactflow';
import './FlowNode.css';
import FlowNodeIcons from "./FlowNodeIcons";
import {ErrorNumber, ExecutionSeqNumber, WarningNumber} from "./NodeAlerts";
import {isObject} from '../../misc/typeChecking';
import {objectMap} from "../../misc/mappers";
import useTheme from "@mui/material/styles/useTheme";
import ThresholdIcon from "./ThresholdIcon";


const FlowNodeWithEventsDynamic = ({data}) => {

    const theme = useTheme()

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
    const nodeStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true)
        ? {
            borderColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground :  theme.palette.wf.node.disabled.borderColor,
            color: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedColor : theme.palette.wf.node.disabled.color,
            backgroundColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.disabled.backgroundColor,
        }
        : {
            borderColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.border,
            color: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedColor : theme.palette.wf.node.color,
            backgroundColor: (data?.metadata?.clicked === true) ? theme.palette.wf.node.selectedBackground : theme.palette.wf.node.background,
        }
    const portStyle = (data?.spec?.skip === true || data?.spec?.block_flow === true)
        ? {
            borderColor: theme.palette.wf.node.disabled.borderColor,
            backgroundColor: theme.palette.common.white,
        }
        : {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.common.white,
            borderWidth: 2
        }
    const backgroundStyle = (data?.spec?.skip===true || data?.spec?.block_flow===true) ? {backgroundColor: "#aaa"} : {}

    return (
        <div style={{position: "relative"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <div>
                    {data?.spec?.run_once?.enabled && <ThresholdIcon style={{width: "100%"}}/>}
                    {data?.debugging?.node?.warnings > 0 && data?.debugging?.node?.errors === 0 && <WarningNumber
                        data={data} style={{backgroundColor: theme.palette.background.default}}/>}
                    {data?.debugging?.node?.errors > 0 && <ErrorNumber data={data}
                                                                       style={{backgroundColor: theme.palette.background.default}}/>}
                    <Inputs spec={data?.spec} documentation={data?.metadata?.documentation?.inputs} style={portStyle}/>
                    <div className={nodeClass} style={nodeStyle}>
                        <ExecutionSeqNumber data={data}/>
                        <div className="NodePadding">
                            <FlowNodeIcons icon={data?.metadata?.icon}/>
                            <div className="NodeLabel"
                                 style={{maxWidth: data?.metadata?.width, maxHeight: data?.metadata?.height}}>
                                <p style={{marginLeft: 5}}>{data?.metadata?.name}</p>
                                <aside>v.{data?.spec?.version}</aside>
                            </div>
                        </div>
                        {data?.metadata?.pro ? <div className="NodePro" style={backgroundStyle}>Pro</div> : ""}
                    </div>
                    <Outputs spec={data?.spec} documentation={data?.metadata?.documentation?.outputs} style={portStyle}/>
                </div>
                {isObject(data?.metadata?.emits_event) && <div className="NodeOutboundEvents">
                    {objectMap(data?.metadata?.emits_event,(name, eventType)  => <span className="Event" key={name}>{name}</span>)}
                </div>}

            </div>
        </div>
    );
};

const FlowNodeWithEvents = React.memo(FlowNodeWithEventsDynamic);
export default FlowNodeWithEvents;
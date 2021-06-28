import React, {useEffect, useRef, useState} from 'react';
import {
    ReactFlowProvider, isNode
} from 'react-flow-renderer';
import './FlowEditor.css'
import Sidebar from "./Sidebar";
import Button from "../elements/forms/Button";
import FlowNode from "./FlowNode";
import {request} from "../../remote_api/uql_api_endpoint";
import NodeDetails from "./NodeDetails";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {FiEdit3} from "@react-icons/all-files/fi/FiEdit3";
import {TiTickOutline} from "@react-icons/all-files/ti/TiTickOutline";
import {RiExchangeFundsFill} from "@react-icons/all-files/ri/RiExchangeFundsFill";
import {VscDebugAlt} from "@react-icons/all-files/vsc/VscDebugAlt";
import FormDrawer from "../elements/drawers/FormDrawer";
import FlowForm from "../elements/forms/FlowForm";
import {VscDebugStepBack} from "@react-icons/all-files/vsc/VscDebugStepBack";
import {VscDebugStepOver} from "@react-icons/all-files/vsc/VscDebugStepOver";
import {VscActivateBreakpoints} from "@react-icons/all-files/vsc/VscActivateBreakpoints";
import {BiRun} from "@react-icons/all-files/bi/BiRun";
import FlowEditorPane, {prepareFlowPayload, save} from "./FlowEditorPane";

const FlowEditor = ({showAlert}) => {

    let {id} = useParams();

    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [filterTask, setFilterTask] = useState("");
    const [currentNode, setCurrentNode] = useState({});
    const [elements, setElements] = useState(null);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState(null)
    const [draft, setDraft] = useState(true);
    const [activeButtons, setActiveButtons] = useState(false);
    const [saving, setSaving] = useState(false);
    const [debugging, setDebugging] = useState(false);

    let modified
    modified = modified || false

    console.log("modified start", modified)

    const onSaveDraft = (deploy = false) => {

        if (reactFlowInstance) {
            save(id,
                flowMetaData,
                reactFlowInstance,
                (e) => {showAlert(e)},
                ()=>{},
                setSaving,
                deploy);
            // const payload = prepareFlowPayload(id, flowMetaData, reactFlowInstance)
            // // const flow = reactFlowInstance.toObject();
            // // let payload = {
            // //     id: id,
            // //     name: flowMetaData.name,
            // //     description: flowMetaData.description,
            // //     enabled: flowMetaData.enabled,
            // //     flowGraph: {
            // //         nodes: [],
            // //         edges: []
            // //     },
            // //     projects: flowMetaData.projects
            // // }
            // //
            // // flow.elements.map((element) => {
            // //     if (isNode(element)) {
            // //         return payload.flowGraph.nodes.push(element)
            // //     } else {
            // //         return payload.flowGraph.edges.push(element)
            // //     }
            // // });
            // setSaving(true);
            // request(
            //     {
            //         url: (deploy === false) ? "/flow/draft" : "/flow",
            //         method: "POST",
            //         data: payload
            //     },
            //     setSaving,
            //     (e) => {
            //         if (e) {
            //             showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
            //         }
            //     },
            //     (data) => {
            //         if (data) {
            //             modified = false;
            //             console.log("mofidies after save", modified)
            //         }
            //     }
            // )
        } else {
            console.error("Can not save Editor not ready.");
        }
    }

    const onBackgroundSave = () => {
        console.log("modified before save", modified)
        if (modified) {
            onSaveDraft(false);
        } else {
            console.log("not changed")
        }
    }

    // useEffect(() => {
    //     const timer = setInterval(
    //         onBackgroundSave,
    //             5000
    //         );
    //
    //     return () => {
    //         if (timer) {
    //             clearInterval(timer);
    //         }
    //
    //     };
    // }, [])

    const onConfig = (config) => {
        // modified = true;
    }

    const onDebug = () => {
        onSaveDraft(false);
        debug(id,
            reactFlowInstance,
            (e)=>showAlert({message: e[0].msg, type: "error", hideAfter: 2000}),
            setDebugging,
            (elements)=>setElements(elements))
        // setDebugging(true);
        // request(
        //     {
        //         url: "/flow/" + id + "/debug",
        //         method: "POST",
        //     },
        //     setDebugging,
        //     (e) => {
        //         if (e) {
        //             showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
        //         }
        //     },
        //     (data) => {
        //         if (data) {
        //             const flow = reactFlowInstance.toObject();
        //             flow.elements.map((element) => {
        //                 if (isNode(element)) {
        //                     if (data.data.calls[element.id]) {
        //                         element.data['debugging'] = data.data.calls[element.id]
        //                     } else {
        //                         delete element.data.debugging
        //                     }
        //                 }
        //             });
        //             setElements(flow.elements || []);
        //         }
        //     }
        // )
    }

    const Saved = () => {
        return (modified)
            ? <span className="AlertTag"><RiExchangeFundsFill size={20} style={{marginRight: 5}}/>Modified</span>
            : <span className="OKTag"><TiTickOutline size={20} style={{marginRight: 5}}/>Saved</span>

    }

    const onNodeClick = (element) => {
        setCurrentNode(element)
    }

    const onEditorReady = (reactFlowInstance) => {
        setActiveButtons(true);
        setReactFlowInstance(reactFlowInstance);
    }

    const onFlowLoad = (flowMetadata) => {
        setFlowMetaData(flowMetadata);
    }

    const onFlowLoadError = (e) => {
        showAlert(e);
    }

    const onDisplayDetails = (element) => {
        setCurrentNode(element);
        setDisplayDetails(true);
    }

    const onHideDetails = () => {
        setDisplayDetails(false);
    }

    return (
        <ReactFlowProvider>
            <div className="FlowEditor">
                <div className="WorkArea">
                    <aside className="RightColumn">
                        <Sidebar/>
                    </aside>
                    <div className="LeftColumn">
                        <div className="FlowTitle">
                            <span style={{display: "flex", alignItems: "center"}}>
                                {draft && <span className="NormalTag">
                                    <VscActivateBreakpoints size={20} style={{marginRight: 5}}/>
                                    <span> This is a draft of workflow:&nbsp;</span>
                                    {flowMetaData?.name}
                                </span>}
                                {!draft && flowMetaData?.name}
                                <Saved/>
                            </span>
                            <span style={{display: "flex"}}>
                                <Button label="Edit"
                                        onClick={() => setFlowFormOpened(true)}
                                        disabled={!activeButtons}
                                        icon={<FiEdit3 size={14} style={{marginRight: 8}}/>}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Debug"
                                        disabled={!activeButtons}
                                        icon={<VscDebugAlt size={14} style={{marginRight: 8}}/>}
                                        onClick={onDebug}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Save draft"
                                        progress={saving}
                                        icon={<VscActivateBreakpoints size={20} style={{marginRight: 5}}/>}
                                        disabled={!activeButtons}
                                        onClick={() => onSaveDraft(false)}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Save & Deploy"
                                        disabled={!activeButtons}
                                        icon={<BiRun size={20} style={{marginRight: 5}}/>}
                                        onClick={() => {
                                            onSaveDraft(true)
                                        }}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Revert"
                                        progress={saving}
                                        disabled={!activeButtons}
                                        icon={<VscDebugStepBack size={15} style={{marginRight: 5}}/>}
                                        onClick={() => {
                                            setDraft(false)
                                        }}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Draft"
                                        progress={saving}
                                        disabled={!activeButtons}
                                        icon={<VscDebugStepOver size={15} style={{marginRight: 5}}/>}
                                        onClick={() => {
                                            setDraft(true)
                                        }}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                            </span>

                        </div>
                        <FlowEditorPane id={id}
                                        onEditorReady={onEditorReady}
                                        onNodeClick={onNodeClick}
                                        onFlowLoad={onFlowLoad}
                                        onFlowLoadError={onFlowLoadError}
                                        onDisplayDetails={onDisplayDetails}
                                        onHideDetails={onHideDetails}
                                        draft={draft}
                        />
                        {displayDetails && <NodeDetails
                            node={currentNode}
                            onConfig={onConfig}
                        />}
                    </div>
                </div>
            </div>
            <FormDrawer
                width={800}
                label="Flow details"
                onClose={() => {
                    setFlowFormOpened(false)
                }}
                open={flowFormOpened}>
                <FlowForm id={id}
                          name={flowMetaData?.name}
                          description={flowMetaData?.description}
                          enabled={flowMetaData?.enabled}
                          projects={flowMetaData?.projects}
                          draft={true}
                          onFlowSaveComplete={({name, description, enabled, projects}) => {
                              setFlowMetaData({name, description, enabled, projects});
                              setFlowFormOpened(false)
                          }}/>
            </FormDrawer>
        </ReactFlowProvider>
    );
};

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowEditor)
import React, {useEffect, useState} from 'react';
import {
    ReactFlowProvider
} from 'react-flow-renderer';
import './FlowEditor.css'
import Sidebar from "./Sidebar";
import Button from "../elements/forms/Button";
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
import {VscActivateBreakpoints} from "@react-icons/all-files/vsc/VscActivateBreakpoints";
import {BiRun} from "@react-icons/all-files/bi/BiRun";
import FlowEditorPane from "./FlowEditorPane";
import {save, debug} from "./FlowEditorOps";
import MenuItem from "@material-ui/core/MenuItem";
import SelectItems from "../elements/forms/SelectItems";

const FlowEditor = ({showAlert}) => {

    let {id} = useParams();

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(null);
    const [filterTask, setFilterTask] = useState("");
    const [currentNode, setCurrentNode] = useState({});
    const [displayDetails, setDisplayDetails] = useState(false);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState(null)
    const [activeButtons, setActiveButtons] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modified, setModified] = useState(false);
    const [debugging, setDebugging] = useState(false);

    const onSaveDraft = (deploy = false) => {

        if (reactFlowInstance) {
            save(id,
                flowMetaData,
                reactFlowInstance,
                (e) => {
                    showAlert(e)
                },
                () => {
                    setModified(false);
                },
                setSaving,
                deploy);
        } else {
            console.error("Can not save Editor not ready.");
        }
    }

    useEffect(() => {
        const timer = setInterval(
            () => {
                if (modified === true) {
                    onSaveDraft(false);
                }
            },
            5000
        );

        return () => {
            if (timer) {
                clearInterval(timer);
            }

        };
    }, [modified])

    const onConfig = (config) => {
        setModified(true);
    }

    const onDebug = () => {
        debug(
            id,
            reactFlowInstance,
            (e) => showAlert(e),
            setDebugging,
            (elements) => setElements(elements)
        )
    }

    const Saved = () => {
        return (modified)
            ? <span className="AlertTag"><RiExchangeFundsFill size={20} style={{marginRight: 5}}/>Modified</span>
            : <span className="OKTag"><TiTickOutline size={20} style={{marginRight: 5}}/>Saved</span>

    }

    // --- Editor ---

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

    const onChange = () => {
        setModified(true);
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
                                    {flowMetaData?.name}
                                <Saved/>
                            </span>
                            <span style={{display: "flex"}}>
                                <Button label="Edit"
                                        onClick={() => setFlowFormOpened(true)}
                                        disabled={!activeButtons}
                                        icon={<FiEdit3 size={14} style={{marginRight: 8}}/>}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Debug"
                                        progress={debugging}
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
                            </span>

                        </div>
                        <FlowEditorPane id={id}
                                        reactFlowInstance={reactFlowInstance}
                                        elements={elements}
                                        setElements={setElements}
                                        onEditorReady={onEditorReady}
                                        onNodeClick={onNodeClick}
                                        onFlowLoad={onFlowLoad}
                                        onFlowLoadError={onFlowLoadError}
                                        onDisplayDetails={onDisplayDetails}
                                        onHideDetails={onHideDetails}
                                        onChange={onChange}
                                        draft={true}
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
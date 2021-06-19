import React, {useEffect, useRef, useState} from 'react';
import ReactFlow, {
    removeElements,
    addEdge,
    Controls,
    Background,
    ReactFlowProvider, isNode
} from 'react-flow-renderer';
import './FlowEditor.css'
import Sidebar from "./Sidebar";
import Button from "../elements/forms/Button";
import FlowNode from "./FlowNode";
import {v4 as uuid4} from 'uuid';
import {request} from "../../remote_api/uql_api_endpoint";
import NodeDetails from "./NodeDetails";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {useParams} from "react-router-dom";
import {VscDebugStart} from "@react-icons/all-files/vsc/VscDebugStart";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {FiEdit3} from "@react-icons/all-files/fi/FiEdit3";
import {TiTickOutline} from "@react-icons/all-files/ti/TiTickOutline";
import {RiExchangeFundsFill} from "@react-icons/all-files/ri/RiExchangeFundsFill";
import {VscDebugAlt} from "@react-icons/all-files/vsc/VscDebugAlt";
import FormDrawer from "../elements/drawers/FormDrawer";
import FlowForm from "../elements/forms/FlowForm";

const snapGrid = [20, 20];
const nodeTypes = {
    flowNode: FlowNode
};

const FlowEditor = ({showAlert}) => {

    let {id} = useParams();

    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [filterTask, setFilterTask] = useState("");
    const [currentNode, setCurrentNode] = useState({});
    const [elements, setElements] = useState(null);
    const [flowLoading, setFlowLoading] = useState(false);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [flowSaved, setFlowSaved] = useState(true);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState({})


    const onSave = () => {

        if(reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            let payload = {
                id: id,
                name: flowMetaData.name,
                description: flowMetaData.description,
                flowGraph: {
                    nodes: [],
                    edges: []
                },
                projects: flowMetaData.projects
            }

            console.log("paylaod", payload)

            flow.elements.map((element) => {
                if (isNode(element)) {
                    return payload.flowGraph.nodes.push(element)
                } else {
                    return payload.flowGraph.edges.push(element)
                }
            });

            request(
                {
                    url: "/flow",
                    method: "POST",
                    data: payload
                },
                () => {
                },
                (e) => {
                    if (e) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
                    }

                },
                (data) => {
                    if (data) {
                        setFlowSaved(true);
                    }
                }
            )
        } else {
            console.error("Can not save Editor not ready.");
        }
    }

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
        onSave();
    }

    const onConnect = (params) => {
        setElements((els) => addEdge(params, els));
        onSave();
    }

    useEffect(() => {
        setFlowLoading(true);
        request({
                url: "/flow/" + id,
            },
            setFlowLoading,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            },
            (response) => {
                if (response?.data) {
                    setFlowMetaData({
                        name: response?.data?.name,
                        description: response?.data?.description,
                        enabled: response?.data?.enabled,
                        projects: response?.data?.projects,
                    });
                    let flowGraph = []
                    if (response?.data?.flowGraph) {
                        flowGraph = response.data.flowGraph.nodes.slice();
                        flowGraph = flowGraph.concat(response.data.flowGraph.edges.slice())
                    }
                    setElements(flowGraph);
                } else if (response.data === null) {
                    // Missing flow
                    showAlert({message: "This work flow is missing", type: "warning", hideAfter: 2000});
                }
            })
    }, [id, showAlert])

    const onLoad = (reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const payload = event.dataTransfer.getData('application/json');
        const data = JSON.parse(payload)
        const newNode = {
            id: uuid4(),
            type: data.metadata.type,
            position,
            data: data
        };
        setElements((es) => es.concat(newNode));
        onSave();
    };

    const onElementClick = (event, element) => {
        setCurrentNode(element);
    }

    const onNodeDoubleClick = (event, element) => {
        setCurrentNode(element)
        setDisplayDetails(true);
    }

    const onSelectionChange = (elements) => {
        setFlowSaved(false);
    }

    const onPaneClick = () => {
        setDisplayDetails(false);
    }

    const onNodeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
        setDisplayDetails(false);
    }

    const onConfig = (config) => {
        onSave();
    }

    const onDebug = () => {
        onSave()
        request(
            {
                url: "/flow/" + id + "/debug",
                method: "POST",
            },
            () => {
            },
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
                }
            },
            (data) => {
                if(data) {
                    const flow = reactFlowInstance.toObject();
                    flow.elements.map((element) => {
                        if (isNode(element)) {
                            if (data.data.calls[element.id]) {
                                element.data['debugging'] = data.data.calls[element.id]
                            } else {
                                delete element.data.debugging
                            }
                        }
                    });
                    setElements(flow.elements || []);
                }
            }
        )
    }

    const Saved = () => {
        return (flowSaved) ? <TiTickOutline size={20} style={{marginLeft: 5, color: "darkgreen"}}/> : <RiExchangeFundsFill size={20} style={{marginLeft: 5}}/>
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
                            <span style={{display: "flex", alignItems: "center"}}>{flowMetaData.name} <Saved /></span>
                            <span style={{display: "flex"}}>
                                <Button label="Edit"
                                        onClick={()=>setFlowFormOpened(true)}
                                        disabled={reactFlowInstance === null}
                                        icon={<FiEdit3 size={14} style={{marginRight: 8}}/>}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Debug"
                                        disabled={reactFlowInstance === null}
                                        icon={<VscDebugAlt size={14} style={{marginRight: 8}}/>}
                                        onClick={onDebug}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Save"
                                        disabled={reactFlowInstance === null}
                                        onClick={onSave}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                                <Button label="Save & Deploy"
                                        disabled={reactFlowInstance === null}
                                        icon={<VscDebugStart size={15} style={{marginRight: 5}}/>}
                                        style={{padding: "5px 10px", margin: 1, fontSize: 14}}/>
                            </span>

                        </div>
                        <div className="FlowPane" ref={reactFlowWrapper}>
                            {flowLoading && <CenteredCircularProgress/>}
                            {elements && <ReactFlow
                                elements={elements}
                                zoomOnDoubleClick={false}
                                zoomOnScroll={true}
                                onElementsRemove={onElementsRemove}
                                onElementClick={onElementClick}
                                onNodeDoubleClick={onNodeDoubleClick}
                                onSelectionChange={onSelectionChange}
                                onNodeContextMenu={onNodeContextMenu}
                                onPaneClick={onPaneClick}
                                nodeTypes={nodeTypes}
                                onConnect={onConnect}
                                deleteKeyCode={46}
                                onLoad={onLoad}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                snapToGrid={true}
                                snapGrid={snapGrid}
                                style={{background: "white"}}
                                defaultZoom={1}
                            >
                                <Controls/>
                                <Background color="#555" gap={16}/>
                            </ReactFlow>}
                        </div>
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
                onClose={()=>{setFlowFormOpened(false)}}
                open={flowFormOpened}>
                <FlowForm id={id}
                          name={flowMetaData?.name}
                          description={flowMetaData?.description}
                          enabled={flowMetaData?.enabled}
                          projects={flowMetaData?.projects}
                          onFlowSaveComplete={({name, description, enabled, projects})=> {
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
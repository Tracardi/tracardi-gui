import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ReactFlow, {
    addEdge,
    Background,
    isEdge,
    isNode,
    removeElements, useZoomPanHelper
} from "react-flow-renderer";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import FlowNode from "./FlowNode";
import {v4 as uuid4} from "uuid";
import {request} from "../../remote_api/uql_api_endpoint";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import {debug, save} from "./FlowEditorOps";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {MemoNodeDetails} from "./NodeDetails";
import InfoEdge from "./edges/InfoEdge";
import StopEdge from "./edges/StopEdge";
import CancelEdge from "./edges/CancelEdge";
import BoldEdge from "./edges/BoldEdge";
import {NodeInitForm} from "../elements/forms/NodeInitForm";
import WfSchema from "./WfSchema";
import {MemoDebugPane} from "./DebugPane";
import convertNodesToProfilingData from "./profilingConverter";
import {FlowEditorBottomLine} from "./FlowEditorBottomLine";
import FlowEditorTitle from "./FlowEditorTitle";

export function FlowEditorPane(
    {
        id,
        flowMetaData,
        reactFlowInstance = null,
        onFlowLoad,
        onEditorReady,
        onEdit,
        locked = false,
        draft = true,
        schema,
        showAlert
    }) {

    const snapGrid = [20, 20];
    const nodeTypes = {
        flowNode: FlowNode
    };

    const edgeTypes = {
        info: InfoEdge,
        stop: StopEdge,
        cancel: CancelEdge,
        default: BoldEdge
    };

    const {zoomIn, zoomOut} = useZoomPanHelper();

    const reactFlowWrapper = useRef(null);
    const [flowLoading, setFlowLoading] = useState(false);
    const [currentNode, setCurrentNode] = useState({});
    const [debugNodeId, setDebugNode] = useState(null);
    const [profilingData, setProfilingData] = useState({
        startTime: 0,
        endTime: 0,
        calls: []
    });
    const [displayRightSidebar, setDisplayRightSidebar] = useState(false);
    const [displayDebugPane, setDisplayDebugPane] = useState(false);
    const [displayDebugHeight, setDisplayDebugHeight] = useState({gridTemplateRows: "calc(100% - 33px) 33px"});
    const [displayNodeContextMenu, setDisplayNodeContextMenu] = useState(false);
    const [animatedEdge, setAnimatedEdge] = useState(null);
    const [elements, setElements] = useState([]);
    const [logs, setLogs] = useState([]);
    const [label, setLabel] = useState({name: "", id: null});
    const [debugInProgress, setDebugInProgress] = useState(false);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);

    const [modified, setModified] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const updateFlow = useCallback((data) => {
        if (data) {
            if (onFlowLoad) {
                const payload = {
                    wf_schema: {
                        uri: data?.wf_schema?.uri,
                        version: data?.wf_schema?.version,
                        server_version: data?.wf_schema?.server_version
                    },
                    name: data?.name,
                    description: data?.description,
                    enabled: data?.enabled,
                    projects: data?.projects,
                }
                onFlowLoad(payload);
            }

            let flowGraph = []
            if (data?.flowGraph) {
                flowGraph = data.flowGraph.nodes.slice();
                flowGraph = flowGraph.concat(data.flowGraph.edges.slice())
            }
            setElements(flowGraph);
        } else if (data === null) {
            // Missing flow
            if (showAlert) {
                showAlert({message: "This workflow is missing", type: "warning", hideAfter: 2000});
            } else {
                alert("This workflow is missing")
            }
        }
    }, [showAlert, onFlowLoad]);

    const handleDraftSave = useCallback((deploy = false) => {

        if (reactFlowInstance) {
            save(id,
                flowMetaData,
                reactFlowInstance,
                (e) => {
                    showAlert({message: e.toString(), type: "error", hideAfter: 2000});
                },
                () => {
                    setModified(false);
                    if (deploy) {
                        setDeployed(true);
                    }
                },
                () => {
                },
                deploy);
        } else {
            showAlert({message: "Can not save Editor not ready.", type: "warning", hideAfter: 2000});
        }
    }, [flowMetaData, reactFlowInstance, id, showAlert]);

    useEffect(() => {
        const timer = setInterval(
            () => {
                if (modified === true) {
                    handleDraftSave(false);
                }
            },
            5000
        );

        return () => {
            if (timer) {
                clearInterval(timer);
            }

        };
    }, [modified, handleDraftSave])

    useEffect(() => {
        setFlowLoading(true);

        request({
                    url: ((draft) ? "/flow/draft/" : "/flow/production/") + id,
                },
                setFlowLoading,
                (e) => {
                    if (e) {
                        if(e.response.status === 404) {
                            showAlert({message: "Workflow does not exist.", type: "error", hideAfter: 4000});
                        } else {
                            showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                        }
                    }
                },
                (response) => {
                    updateFlow(response?.data);
                })


    }, [id, draft, showAlert, updateFlow])


    useEffect(() => {
        setElements((els) => els.map((el) => {
                if (isEdge(el)) {
                    if (animatedEdge === null) {
                        if (el?.style?.stroke === '#ad1457') {
                            const {stroke, ...newStyle} = el.style
                            el.style = newStyle
                        }

                    } else if (el.id === animatedEdge) {
                        el.style = {
                            stroke: '#ad1457'
                        }
                    } else {
                        if (el?.style?.stroke === '#ad1457') {
                            const {stroke, ...newStyle} = el.style
                            el.style = newStyle
                        }
                    }
                }

                if (isNode(el)) {
                    el.data = {
                        ...el.data,
                        metadata: {...el.data.metadata, selected: el.id === debugNodeId},
                    }
                }

                return el;
            })
        );

    }, [animatedEdge, debugNodeId])

    useEffect(() => {
        setElements((els) => els.map((el) => {
                if (isNode(el) && el.id === label.id) {
                    el.data = {
                        ...el.data,
                        metadata: {...el.data.metadata, name: label.name},
                    }
                }
                return el;
            })
        );

    }, [label, setElements]);

    const handleUpdate = () => {
        setModified(true);
        setDeployed(false);
    }

    const onLoad = (reactFlowInstance) => {
        reactFlowInstance.fitView();
        onEditorReady(reactFlowInstance)
    };

    const handleDisplayDebugPane = (flag) => {
        if (flag === true) {
            setDisplayDebugPane(true);
            setDisplayDebugHeight({gridTemplateRows: "calc(100% - 400px) 400px"});
        } else {
            setDisplayDebugPane(false);
            setDisplayDebugHeight({gridTemplateRows: "calc(100% - 33px) 33px"})
        }
    }

    const onDebug = () => {
        setDebugNode(null);
        setAnimatedEdge(null);
        setDisplayNodeContextMenu(false);
        debug(
            id,
            reactFlowInstance,
            (e) => showAlert(e),
            setDebugInProgress,
            ({elements, logs}) => {
                setElements(elements);
                setLogs(logs);
                setProfilingData(convertNodesToProfilingData(elements))
                handleDisplayDebugPane(true);
            }
        )
    }

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
        handleUpdate();
    }

    const onConnect = (params) => {
        setElements((els) => addEdge(params, els));
        setDisplayNodeContextMenu(false);
        handleUpdate();
    }

    const onDrop = (event) => {
        try {
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
            handleUpdate();
        } catch (e) {
            alert("Json error. Dropped element without json.");
        }

    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onNodeDoubleClick = (event, element) => {
        selectNode(element)
        setDisplayRightSidebar(true);
        setDisplayNodeContextMenu(false);
    }

    const onElementClick = (event, element) => {
        if (onNodeClick) {
            onNodeClick(event, element);
        }

    }

    const onPaneClick = () => {
        setDisplayRightSidebar(false);
        handleDisplayDebugPane(false);
        setDebugNode(null);
        setAnimatedEdge(null);
        selectNode(null);
        setDisplayNodeContextMenu(false);
    }

    const onNodeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
        selectNode(element);
        setDisplayNodeContextMenu(true);
        setClientX(event?.clientX - 50);
        setClientY(event?.clientY - 50)
    }

    const onEdgeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const selectNode = (node) => {
        setCurrentNode(node)
    }

    const onNodeClick = (event, element) => {
        selectNode(element);
        setDisplayNodeContextMenu(false);
        if (element.data?.debugging && Array.isArray(element.data?.debugging)
            && element.data?.debugging.length > 0 && element.data?.debugging[0]?.edge?.id) {
            setAnimatedEdge(element.data.debugging[0].edge.id);
        } else {
            setAnimatedEdge(null);
        }
        selectNode(element);
    }

    const onConfigSave = (value) => {
        currentNode.data.spec.init = value
        handleUpdate()
    }

    const onConnectionDetails = (nodeId, edgeId) => {
        setDebugNode(nodeId)
        setAnimatedEdge(edgeId);
    }

    const handleEditClick = (data) => {
        if (onEdit) {
            onEdit(data);
        }
    }

    const handleLabelSet = (label) => {
        if (elements) {
            setLabel({id: currentNode.id, name: label})
        }
        handleUpdate()
    }

    const ModifiedTag = () => {
        return <span style={{
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            padding:"3px 9px",
            borderRadius: 15,
            marginLeft: 5,
            backgroundColor: "orange"
        }}>not saved</span>
    }

    const DeployedTag = () => {
        return <span style={{
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            padding:"3px 9px",
            borderRadius: 15,
            marginLeft: 5,
            backgroundColor: "green"
        }}>deployed</span>
    }

    const StatusTag = () => {
        return <div style={{
            position: "absolute",
            top: 5,
            right: 5,
            display: "flex",
        }}>
            {modified && <ModifiedTag/>}
            {deployed && <DeployedTag/>}
        </div>
    }

    return <>
        <FlowEditorTitle
            flowId={id}
            reactFlowInstance={reactFlowInstance}
            flowMetaData={flowMetaData}
            onDraftRestore={(flow) => {updateFlow(flow)}}
            onDeploy={()=>setDeployed(true)}
            onSaveDraft={()=>setModified(false)}
        />
        <div className="FlowEditor">
            <div className="WorkArea">
                <div className="FlowEditorGrid" style={displayDebugHeight}>
                    <div className="FlowPane" ref={reactFlowWrapper}>
                        {flowLoading && <CenteredCircularProgress/>}
                        {!flowLoading && elements && <ReactFlow
                            elements={elements}
                            zoomOnDoubleClick={false}
                            zoomOnScroll={false}
                            panOnScroll={true}
                            onElementsRemove={onElementsRemove}
                            onElementClick={onElementClick}
                            onNodeDoubleClick={onNodeDoubleClick}
                            // onSelectionChange={onSelectionChange}
                            onNodeContextMenu={onNodeContextMenu}
                            onEdgeContextMenu={onEdgeContextMenu}
                            onPaneClick={onPaneClick}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onConnect={onConnect}
                            deleteKeyCode={46}
                            zoomActivationKeyCode={32}
                            multiSelectionKeyCode={32}
                            onLoad={onLoad}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            snapToGrid={false}
                            snapGrid={snapGrid}
                            nodesDraggable={!locked}
                            style={{background: "white"}}
                            defaultZoom={1}
                        >
                            <SidebarLeft onDebug={onDebug}
                                         debugInProgress={debugInProgress}
                            />

                            {displayNodeContextMenu && currentNode?.data?.spec?.form && <div className="NodeContextForm"
                                                                                             style={{
                                                                                                 left: clientX,
                                                                                                 top: clientY
                                                                                             }}
                            >
                                <NodeInitForm
                                    pluginId={currentNode?.data?.spec?.id}
                                    init={currentNode?.data?.spec?.init}
                                    formSchema={currentNode?.data?.spec?.form}
                                    onSubmit={onConfigSave}
                                />
                            </div>}

                            <WfSchema schema={schema}
                                      style={{
                                          position: "absolute",
                                          color: "#555",
                                          bottom: 5,
                                          right: 10,
                                          fontSize: "80%",
                                          display: "flex",
                                          alignItems: "center"
                                      }}/>

                            <StatusTag/>

                            <Background color="#444" gap={16}/>
                        </ReactFlow>}
                    </div>

                    {displayRightSidebar && <SidebarRight>
                        <MemoNodeDetails
                            onLabelSet={handleLabelSet}
                            node={currentNode}
                            onConfig={onConfigSave}
                        />
                    </SidebarRight>}

                    {displayDebugPane && <MemoDebugPane
                        profilingData={profilingData}
                        logs={logs}
                        onDetails={onConnectionDetails}
                        onDebug={onDebug}
                    />}

                    {!displayDebugPane && <FlowEditorBottomLine
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onEdit={handleEditClick}
                        onDebug={() => handleDisplayDebugPane(true)}
                    />}

                </div>
            </div>
        </div>
    </>
}

FlowEditorPane.propTypes = {
    id: PropTypes.string.isRequired,
    flowMetaData: PropTypes.object.isRequired,
    onFlowLoad: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    reactFlowInstance: PropTypes.object,
    locked: PropTypes.bool,
    draft: PropTypes.bool
};

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowEditorPane)
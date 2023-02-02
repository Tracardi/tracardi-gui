import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {
    addEdge,
    Background,
    isEdge,
    isNode,
    useReactFlow,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import "reactflow/dist/style.css"
import React, {Suspense, useCallback, useMemo, useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import FlowNode from "./FlowNode";
import {v4 as uuid4} from "uuid";
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
import WfSchema from "./WfSchema";
import {MemoDebugPane} from "./DebugPane";
import convertNodesToProfilingData from "./profilingConverter";
import {FlowEditorBottomLine} from "./FlowEditorBottomLine";
import FlowEditorTitle from "./FlowEditorTitle";
import FlowNodeWithEvents from "./FlowNodeWithEvents";
import StartNode from "./StartNode";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import NoData from "../elements/misc/NoData";
import Button from "../elements/forms/Button";
import ErrorsBox from "../errors/ErrorsBox";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import EdgeDetails from "./EdgeDetails";
import CondNode from "./CondNode";
import {MdAdsClick} from "react-icons/md";

const ReactFlow = React.lazy(() => import('reactflow'))

const ModifiedTag = () => {
    return <span style={{
        color: "white",
        fontSize: 12,
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: 15,
        marginLeft: 5,
        backgroundColor: "orange"
    }}>not saved</span>
}

const DraftTag = () => {
    return <span style={{
        color: "white",
        fontSize: 12,
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: 15,
        marginLeft: 5,
        backgroundColor: "#ef6c00"
    }}>This is a draft</span>
}

const StatusTag = ({modified, deployed}) => {
    return <div style={{
        position: "absolute",
        top: 5,
        right: 5,
        display: "flex",
    }}>
        {modified && <ModifiedTag/>}
        {!deployed && <DraftTag/>}
    </div>
}

const NodeDetailsHandler = React.memo(({node, onLabelSet, onConfig, onRuntimeConfig, onMicroserviceChange, pro}) => {

    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const go = (url) => {
        return () => navigate(urlPrefix(url));
    }

    useEffect(() => {
        let isSubscribed = true;

        // If node is pro and does not have data ini init or form
        if (pro === true && (node.data.spec.init === null || node.data.spec.form === null)) {

            setLoading(true);
            setError(null);

            asyncRemote({
                url: "/tpro/plugin/" + node?.data?.spec?.module
            }).then(response => {
                if (isSubscribed) {
                    // Add spec data from TPRO
                    if (response?.data?.init && node.data.spec.init === null) node.data.spec.init = response.data.init
                    if (response?.data?.form && node.data.spec.form === null) node.data.spec.form = response.data.form
                    setAvailable(true)
                    setError(null)
                }
            }).catch(e => {
                if (e?.response?.status === 403) {
                    // Access Denied - probably not signed in
                    setAvailable(false)
                } else {
                    setError(getError(e))
                }
            }).finally(() => {
                if (isSubscribed) setLoading(false)
            })

        } else {
            setAvailable(true);
            setError(null);
        }

        return () => {
            isSubscribed = false;
        }

    }, [pro, node])

    if (error !== null) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading || available === null) {
        return <CenteredCircularProgress label="Connecting Tracardi PRO" minWidth={500}/>
    }

    if (available === true) {
        return <MemoNodeDetails
            onLabelSet={onLabelSet}
            node={node}
            onConfig={onConfig}
            onRuntimeConfig={onRuntimeConfig}
            onMicroserviceChange={onMicroserviceChange}
        />
    }

    return <NoData header="Available only as Tracardi Pro service">
        <p style={{textAlign: "center"}}>Please join Tracardi Pro for free and premium connectors and services. It is a
            free lifetime membership.</p>
        <Button label="Sure" onClick={go("/resources/pro")}/>
    </NoData>

})


const DetailsHandler = ({element, onNodeRefresh, onEdgeRefresh, onNodeConfig, onNodeRuntimeConfig, onMicroserviceChange}) => {

    if (isNode(element)) {
        return <SidebarRight>
            <NodeDetailsHandler
                onLabelSet={(value) => {
                    element.data.metadata = {...element.data.metadata, name: value}
                    if (onNodeRefresh instanceof Function) {
                        onNodeRefresh(element)
                    }
                }}
                node={element}
                onConfig={onNodeConfig}
                onRuntimeConfig={onNodeRuntimeConfig}
                onMicroserviceChange={onMicroserviceChange}
                pro={element?.data?.metadata?.pro}
            />
        </SidebarRight>
    } else if (isEdge(element)) {
        return <SidebarRight>
            <EdgeDetails
                edge={element}
                onLabelSubmit={(value) => {
                    element.data = {...element.data, name: value}
                    if (onEdgeRefresh instanceof Function) {
                        onEdgeRefresh(element)
                    }
                }}
            />
        </SidebarRight>
    }

    return ""
}

const edgeTypes = {
    info: InfoEdge,
    stop: StopEdge,
    cancel: CancelEdge,
    default: BoldEdge
};
const nodeTypes = {
    flowNode: FlowNode,
    flowNodeWithEvents: FlowNodeWithEvents,
    startNode: StartNode,
    condNode: CondNode
};


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


    const {zoomIn, zoomOut} = useReactFlow();

    const reactFlowWrapper = useRef(null);
    const [flowLoading, setFlowLoading] = useState(false);
    const [currentNode, setCurrentNode] = useState({});
    const [debugNodeId, setDebugNode] = useState(null);
    const [profilingData, setProfilingData] = useState({
        startTime: 0,
        endTime: 0,
        calls: []
    });
    const [displayElementDetails, setDisplayElementDetails] = useState(false);
    const [displayDebugPane, setDisplayDebugPane] = useState(false);
    const [displayDebugHeight, setDisplayDebugHeight] = useState({gridTemplateRows: "100%"});
    const [displayNodeContextMenu, setDisplayNodeContextMenu] = useState(false);
    const [animatedEdge, setAnimatedEdge] = useState(null);

    const [nodes, setNodes, handleNodesChange] = useNodesState([]);
    const [edges, setEdges, handleEdgesChange] = useEdgesState([]);

    const [logs, setLogs] = useState([]);
    const [refreshNodeId, setRefreshNodeId] = useState([null, null]);  // [nodeId, nodeData]
    const [refreshEdgeId, setRefreshEdgeId] = useState([null, null]);  // [edgeId, edgeData]
    const [debugInProgress, setDebugInProgress] = useState(false);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const selectedNode = useRef({});
    // const copiedNode = useRef(null);
    // const nodePasted = useRef(false);

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
                    projects: data?.projects,
                    type: data?.type
                }
                onFlowLoad(payload);
            }

            if (data?.flowGraph) {
                setNodes(data.flowGraph.nodes)
                setEdges(data.flowGraph.edges)
            }
        } else if (data === null) {
            // Missing flow
            if (showAlert) {
                showAlert({message: "This workflow is missing", type: "warning", hideAfter: 2000});
            } else {
                alert("This workflow is missing")
            }
        }
    }, [setNodes, setEdges, showAlert, onFlowLoad]);

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
        let isSubscribed = true;

        asyncRemote({
            url: ((draft) ? "/flow/draft/" : "/flow/production/") + id,
        }).then((response) => {
            if (response && isSubscribed === true) {
                updateFlow(response?.data);
            }
        }).catch((e) => {
            if (e && isSubscribed === true) {
                if (e?.response?.status === 404) {
                    showAlert({message: "Workflow does not exist.", type: "error", hideAfter: 4000});
                } else {
                    e = getError(e)
                    if (e.length > 0) showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            }
        }).finally(() => {
            if (isSubscribed === true) setFlowLoading(false)
        })

        return () => {
            isSubscribed = false
        }

    }, [id, draft, showAlert, updateFlow])


    useEffect(() => {
        setEdges((edges) => edges.map((edge) => {
            if (animatedEdge === null) {
                if (edge?.style?.stroke === '#ad1457') {
                    const {stroke, ...newStyle} = edge.style
                    edge.style = newStyle
                }
            } else if (edge.id === animatedEdge) {
                edge.style = {
                    stroke: '#ad1457'
                }
            } else {
                if (edge?.style?.stroke === '#ad1457') {
                    const {stroke, ...newStyle} = edge.style
                    edge.style = newStyle
                }
            }
            return edge
        }))
        setNodes((nodes) => nodes.map((node) => {
            node.data = {
                ...node.data,
                metadata: {...node.data.metadata, selected: node.id === debugNodeId},
            }
            return node
        }))
    }, [setEdges, setNodes, animatedEdge, debugNodeId])

    useEffect(() => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === refreshNodeId[0]) {
                node.data = {...refreshNodeId[1].data}
            }
            return node;
        }))
    }, [refreshNodeId, setNodes]);


    useEffect(() => {
        setEdges((edges) => edges.map((edge) => {
            if (edge.id === refreshEdgeId[0]) {
                edge.data = {...refreshEdgeId[1].data}
            }
            return edge
        }))

    }, [refreshEdgeId, setEdges]);

    // const handleCtrlVRelease = useCallback((event) => {
    //     if ((event?.ctrlKey || event?.metaKey) || event?.keyCode === 86) {
    //         console.log("handleCtrlVRelease")
    //         nodePasted.current = false;
    //     }
    // }, [])
    //
    // const handleCopyPasteNode = useCallback(event => {
    //     if ((event?.ctrlKey || event?.metaKey) && Object.keys(nodeTypes).includes(selectedNode.current?.type)) {
    //         // Ctrl / Cmd + C
    //         if (event?.keyCode === 67) {
    //             copiedNode.current = selectedNode.current;
    //         }
    //         // Ctrl / Cmd + V
    //         if (event?.keyCode === 86 && !nodePasted.current && selectedNode.current) {
    //             try {
    //                 nodePasted.current = true;
    //                 const data = cloneDeep(copiedNode.current);
    //                 const newNode = {
    //                     ...data,
    //                     id: uuid4(),
    //                     position: {x: data.position.x - 100, y: data.position.y + 50},
    //                 };
    //                 setNodes(nodes.concat(newNode))
    //                 handleUpdate();
    //             } catch (e) {
    //                 alert("Cannot paste node.");
    //             }
    //         }
    //     }
    // },
    //     // nodeTypes never change
    //     // eslint-disable-next-line
    //     [setNodes])

    // useEffect(() => {
    //     const element = reactFlowWrapper.current;
    //     element.tabIndex = "0";
    //     element.addEventListener("keydown", handleCopyPasteNode);
    //     element.addEventListener("keyup", handleCtrlVRelease);
    //     return () => {
    //         element.removeEventListener("keydown", handleCopyPasteNode);
    //         element.removeEventListener("keyup", handleCtrlVRelease);
    //         copiedNode.current = false;
    //         selectedNode.current = null;
    //     }
    // }, [handleCopyPasteNode, handleCtrlVRelease])

    const handleUpdate = () => {
        setModified(true);
        setDeployed(false);
    }

    const onInit = (reactFlowInstance) => {
        // reactFlowInstance.fitView();
        onEditorReady(reactFlowInstance)
    };

    const handleDisplayDebugPane = (flag) => {
        if (flag === true) {
            setDisplayDebugPane(true);
            setDisplayDebugHeight({gridTemplateRows: "calc(100% - 310px) 310px"});
        } else {
            setDisplayDebugPane(false);
            setDisplayDebugHeight({gridTemplateRows: "100%"})
        }
    }

    const handleDebug = () => {
        setDebugNode(null);
        setAnimatedEdge(null);
        setDisplayNodeContextMenu(false);
        debug(
            id,
            reactFlowInstance,
            (e) => showAlert(e),
            setDebugInProgress,
            ({nodes, edges, logs}) => {
                setNodes(nodes)
                setEdges(edges)
                setLogs(logs);
                setProfilingData(convertNodesToProfilingData(nodes))
                handleDisplayDebugPane(true);
            }
        )
    }

    // TODO I don't understand this function mean's what so let it alone
    // const getElementsWithRunOnce = (elements) => {
    //     return elements.reduce((results, element) => {
    //         if (element?.data?.spec?.run_once?.enabled === true) {
    //             results.push(element.id)
    //         }
    //         return results
    //     }, [])
    // }

    const onElementsRemove = () => {
        setDisplayElementDetails(false);
        handleUpdate();
    }

    const onConnect = (params) => {
        setEdges((els) => addEdge(params, els))
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
            setNodes(nodes.concat(newNode))
            handleUpdate();
        } catch (e) {
            alert("Json error. Dropped element without json.");
        }
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onElementDoubleClick = (event, element) => {
        selectNode(element)
        setDisplayElementDetails(true);
        setDisplayNodeContextMenu(false);
    }

    const onPaneClick = () => {
        setDisplayElementDetails(false);
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
        setClientX(event?.clientX - 200);
        setClientY(event?.clientY - 50)
    }

    const onEdgeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const selectNode = (node) => {
        selectedNode.current = node;
        setCurrentNode(node)
    }

    const onNodeClick = (event, node) => {
        selectNode(node);
        setDisplayNodeContextMenu(false);
        if (node.data?.debugging && Array.isArray(node.data?.debugging)
            && node.data?.debugging.length > 0 && node.data?.debugging[0]?.edge?.id) {
            setAnimatedEdge(node.data.debugging[0].edge.id);
        } else {
            setAnimatedEdge(null);
        }
        selectNode(node);
    }

    const handleConfigSave = (value) => {
        currentNode.data.spec.init = value
        handleUpdate()
    }

    const handleRuntimeConfig = (nodeId, value) => {
        if (currentNode.data.spec.id === nodeId) {
            currentNode.data.spec = {...currentNode.data.spec, ...value}

            // Refresh flow node
            if (nodes) {
                setRefreshNodeId([currentNode.id, currentNode])
            }

            handleUpdate();
        } else {
            console.warn("Current node changed")
        }

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

    return <div style={{display: "flex", alignItems: "stretch", flexDirection: "column", height: "100%"}}>
        <FlowEditorTitle
            flowId={id}
            reactFlowInstance={reactFlowInstance}
            flowMetaData={flowMetaData}
            onDraftRestore={(flowData) => {
                updateFlow(flowData)
            }}
            onDeploy={() => setDeployed(true)}
            onSaveDraft={() => setModified(false)}
        />
        <div className="FlowEditor">
            <div className="WorkArea">
                <div className="FlowEditorGrid" style={displayDebugHeight}>
                    <div className="FlowPane" ref={reactFlowWrapper}>
                        {flowLoading && <CenteredCircularProgress/>}
                        {!flowLoading && nodes && <Suspense fallback={<CenteredCircularProgress/>}>
                            <ReactFlow
                                style={{background: "white"}}
                                snapGrid={snapGrid}
                                snapToGrid={false}
                                panOnScroll={true}
                                zoomOnScroll={false}
                                nodesDraggable={!locked}
                                zoomOnDoubleClick={false}
                                deleteKeyCode={["Delete"]}
                                zoomActivationKeyCode={32}
                                multiSelectionKeyCode={32}
                                defaultViewport={{ x: 700, y: 100, zoom: 1 }}

                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}

                                onInit={onInit}
                                onDrop={onDrop}
                                onConnect={onConnect}
                                onDragOver={onDragOver}
                                onPaneClick={onPaneClick}
                                onNodeClick={onNodeClick}
                                onNodesChange={handleNodesChange}
                                onEdgesChange={handleEdgesChange}
                                onNodeContextMenu={onNodeContextMenu}
                                onEdgeContextMenu={onEdgeContextMenu}
                                onNodeDoubleClick={onElementDoubleClick}
                                onEdgeDoubleClick={onElementDoubleClick}
                                onNodesDelete={onElementsRemove}
                                onEdgesDelete={onElementsRemove}
                                // onSelectionChange={onSelectionChange}
                            >
                                <SidebarLeft onDebug={handleDebug}
                                             debugInProgress={debugInProgress}
                                             flowType={flowMetaData?.type}
                                />

                                {displayNodeContextMenu && <div className="NodeContextForm"
                                                                style={{
                                                                    left: clientX,
                                                                    top: clientY
                                                                }}
                                >
                                    <aside>v.{currentNode?.data?.spec?.version}</aside>
                                    {currentNode?.data?.metadata?.desc}
                                    <div style={{marginTop: 10}}>To <u>delete a node</u>: select the node and press
                                        <span className="keyButton">DELETE</span>
                                        key.</div>
                                    <div>To <u>open node properties</u>: <MdAdsClick size={18}/>double click on the node.</div>
                                    <div>To <u>select multiple nodes</u>: press <span className="keyButton">SHIFT</span> and
                                        drag you mouse and make a rectangular selecting the nodes you want.</div>
                                </div>}

                                <WfSchema schema={schema}
                                          style={{
                                              position: "absolute",
                                              color: "#555",
                                              bottom: 17,
                                              right: 5,
                                              fontSize: "80%",
                                              display: "flex",
                                              alignItems: "center"
                                          }}/>

                                <StatusTag modified={modified} deployed={deployed}/>

                                <Background color="#444" gap={16}/>
                            </ReactFlow>
                        </Suspense>}
                    </div>

                    {displayElementDetails && currentNode && <DetailsHandler element={currentNode}
                                                                             onEdgeRefresh={(edge) => {
                                                                                 if (edges) {
                                                                                     setRefreshEdgeId([edge.id, edge])
                                                                                 }
                                                                                 handleUpdate()
                                                                             }}
                                                                             onNodeRefresh={(node) => {
                                                                                 if (nodes) {
                                                                                     setRefreshNodeId([node.id, node])
                                                                                 }
                                                                                 handleUpdate()
                                                                             }}
                                                                             onNodeConfig={handleConfigSave}
                                                                             onNodeRuntimeConfig={handleRuntimeConfig}
                                                                             onMicroserviceChange={handleUpdate}
                    />}

                    {displayDebugPane && <MemoDebugPane onDebug={handleDebug}
                        profilingData={profilingData}
                        logs={logs}
                        onDetails={onConnectionDetails}
                    />}

                </div>
            </div>
        </div>
        <FlowEditorBottomLine
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onEdit={handleEditClick}
            onDebug={() => handleDisplayDebugPane(true)}
        />
    </div>
}

FlowEditorPane.propTypes = {
    id: PropTypes.string.isRequired,
    flowMetaData: PropTypes.object,
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
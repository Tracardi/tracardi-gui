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
import React, {Suspense, useCallback, useContext, useEffect, useRef, useState} from "react";
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
import {getError} from "../../remote_api/entrypoint";
import NoData from "../elements/misc/NoData";
import Button from "../elements/forms/Button";
import ErrorsBox from "../errors/ErrorsBox";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import EdgeDetails from "./EdgeDetails";
import CondNode from "./CondNode";
import {MdAdsClick} from "react-icons/md";
import useTheme from "@mui/material/styles/useTheme";
import {useRequest} from "../../remote_api/requestClient";
import {DataContext} from "../AppBox";

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

const StatusTag = ({modified}) => {
    return <div style={{
        position: "absolute",
        top: 15,
        right: 15,
        display: "flex",
    }}>
        {modified && <ModifiedTag/>}
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

    const {request} = useRequest()

    useEffect(() => {
        let isSubscribed = true;

        // If node is pro and does not have data ini init or form
        if (pro === true && (node.data.spec.init === null || node.data.spec.form === null)) {

            setLoading(true);
            setError(null);

            request({
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
        <Button label="Sure" onClick={go("/resources#pro")}/>
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
        eventId = null,
        flowMetaData,
        reactFlowInstance = null,
        onFlowLoad,
        onEditorReady,
        onEdit,
        locked = false,
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

    const theme = useTheme()
    const {request} = useRequest()
    const dataContext = useContext(DataContext)

    const [modified, setModified] = useState(false);

    const updateFlow = useCallback((data) => {
        if (data) {
            if (onFlowLoad) {
                const payload = {
                    id: data?.id,
                    wf_schema: {
                        uri: data?.wf_schema?.uri,
                        version: data?.wf_schema?.version,
                        server_version: data?.wf_schema?.server_version
                    },
                    timestamp: data?.timestamp || null,
                    deploy_timestamp: data?.deploy_timestamp || null,
                    name: data?.name,
                    description: data?.description,
                    tags: data?.tags,
                    type: data?.type,
                    file_name: data?.file_name
                }
                onFlowLoad(payload);
            }

            if (data?.flowGraph) {
                setNodes(data.flowGraph.nodes)
                setEdges(data.flowGraph.edges)
            } else {
                setNodes([])
                setEdges([])
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

    const handleDraftSave = useCallback(() => {
        if (reactFlowInstance) {
            save(id,
                flowMetaData,
                reactFlowInstance,
                (e) => {
                    showAlert({message: e.toString(), type: "error", hideAfter: 2000});
                },
                () => {
                    setModified(false);
                },
                () => {
                },
                request);
        } else {
            showAlert({message: "Can not save Editor not ready.", type: "warning", hideAfter: 2000});
        }
    }, [flowMetaData, reactFlowInstance, id, showAlert]);

    useEffect(() => {
        const timer = setInterval(
            () => {
                if (modified === true) {
                    handleDraftSave();
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

        request({
            url: "/flow/draft/" + id,
        }).then((response) => {
            if (response && isSubscribed === true) {
                selectNode(null);
                updateFlow(response?.data);
                setDisplayDebugPane(false);
                setDisplayDebugHeight({gridTemplateRows: "100%"})
                setProfilingData({
                    startTime: 0,
                        endTime: 0,
                    calls: []
                })
                setLogs([])
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

    }, [id, showAlert, updateFlow, dataContext])


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
                metadata: {...node.data.metadata, selected: node.id === debugNodeId, clicked: node.id === currentNode?.id},
            }
            return node
        }))
    }, [setEdges, setNodes, animatedEdge, debugNodeId, currentNode])

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

    const handleUpdate = () => {
        setModified(true);
    }

    const onInit = (reactFlowInstance) => {
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

    const handleDebug = useCallback(() => {
        setDebugNode(null);
        setAnimatedEdge(null);
        setDisplayNodeContextMenu(false);
        debug(
            id,
            eventId,
            reactFlowInstance,
            (e) => showAlert(e),
            setDebugInProgress,
            ({nodes, edges, logs}) => {
                setNodes(nodes);
                setEdges(edges);
                setLogs(logs);
                setProfilingData(convertNodesToProfilingData(nodes))
                handleDisplayDebugPane(true);
            },
            request
        )
    }, [id, reactFlowInstance, setEdges, setNodes, showAlert])

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
                x: event.clientX - reactFlowBounds.left - 300,
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
        setClientX(event?.clientX - 500);
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
            onSaveDraft={() => setModified(false)}
        />
        <div className="FlowEditor">
            <div className="WorkArea">
                <div className="FlowEditorGrid" style={{...displayDebugHeight, backgroundColor: theme.palette.background.paper}}>
                    <div className="FlowPane" ref={reactFlowWrapper}>
                        {flowLoading && <CenteredCircularProgress/>}
                        {!flowLoading && nodes && <Suspense fallback={<CenteredCircularProgress/>}>
                            <div style={{display: "flex", width: "100%", height: "100%"}}>
                                <div style={{
                                    width: "322px",
                                    height: "100%",
                                    flex: "0 0 322px"
                                }}>
                                    <SidebarLeft onDebug={handleDebug}
                                                 debugInProgress={debugInProgress}
                                                 flowType={flowMetaData?.type}
                                    />
                                </div>
                                <div style={{width: "100%", flex: 1}}>
                                    <ReactFlow
                                        snapGrid={snapGrid}
                                        snapToGrid={false}
                                        panOnScroll={true}
                                        zoomOnScroll={false}
                                        nodesDraggable={!locked}
                                        zoomOnDoubleClick={false}
                                        deleteKeyCode={["Delete"]}
                                        zoomActivationKeyCode={32}
                                        multiSelectionKeyCode={32}
                                        defaultViewport={{x: 100, y: 100, zoom: 1}}

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
                                        {displayNodeContextMenu && <div className="NodeContextForm"
                                                                        style={{
                                                                            left: clientX,
                                                                            top: clientY
                                                                        }}
                                        >
                                            <aside>v.{currentNode?.data?.spec?.version}</aside>
                                            {currentNode?.data?.metadata?.desc}
                                            <div style={{marginTop: 10}}>To <u>delete a node</u>: select the node and press
                                                <span className="keyButton">DELETE</span>, or
                                                <span className="keyButton">Fn</span> + <span className="keyButton">DELETE</span> on Mac.
                                            </div>
                                            <div>To <u>open node properties</u>: <MdAdsClick size={18}/>double click on the
                                                node.
                                            </div>
                                            <div>To <u>select multiple nodes</u>: press <span
                                                className="keyButton">SHIFT</span> and
                                                drag you mouse and make a rectangular selecting the nodes you want.
                                            </div>
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

                                        <StatusTag modified={modified}/>

                                        <Background color={theme.palette.wf.dots} gap={16}/>
                                    </ReactFlow>
                                </div>
                                {displayElementDetails && currentNode && <div style={{
                                    width: "664px",
                                    height: "100%",
                                    flex: "0 0 664px"
                                }}>
                                    <DetailsHandler element={currentNode}
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
                                    />
                                </div>}
                            </div>
                        </Suspense>}
                    </div>


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
    eventId: PropTypes.string,
    flowMetaData: PropTypes.object,
    onFlowLoad: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    reactFlowInstance: PropTypes.object,
    locked: PropTypes.bool,
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
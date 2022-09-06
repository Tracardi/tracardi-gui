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
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import EdgeDetails from "./EdgeDetails";
import CondNode from "./CondNode";

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

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
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
        return <CenteredCircularProgress label="Connecting Tracardi PRO"/>
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
        flowNode: FlowNode,
        flowNodeWithEvents: FlowNodeWithEvents,
        startNode: StartNode,
        condNode: CondNode
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
    const [displayElementDetails, setDisplayElementDetails] = useState(false);
    const [displayDebugPane, setDisplayDebugPane] = useState(false);
    const [displayDebugHeight, setDisplayDebugHeight] = useState({gridTemplateRows: "calc(100% - 33px) 33px"});
    const [displayNodeContextMenu, setDisplayNodeContextMenu] = useState(false);
    const [animatedEdge, setAnimatedEdge] = useState(null);
    const [elements, setElements] = useState([]);
    const [logs, setLogs] = useState([]);
    const [refreshNodeId, setRefreshNodeId] = useState([null, null]);  // [nodeId, nodeData]
    const [refreshEdgeId, setRefreshEdgeId] = useState([null, null]);  // [edgeId, edgeData]
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
                if (isNode(el) && el.id === refreshNodeId[0]) {
                    el.data = {...refreshNodeId[1].data}
                }
                return el;
            })
        );

    }, [refreshNodeId, setElements]);


    useEffect(() => {
        setElements((els) => els.map((el) => {
                if (isEdge(el) && el.id === refreshEdgeId[0]) {
                    el.data = {...refreshEdgeId[1].data}
                }
                return el;
            })
        );

    }, [refreshEdgeId, setElements]);

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
            setDisplayDebugHeight({gridTemplateRows: "calc(100% - 310px) 310px"});
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

    const getElementsWithRunOnce = (elements) => {
        return elements.reduce((results, element) => {
            if (element?.data?.spec?.run_once?.enabled === true) {
                results.push(element.id)
            }
            return results
        }, [])
    }

    const onElementsRemove = (elementsToRemove) => {

        if (Array.isArray(elementsToRemove)) {
            // todo add endpoint call that removes the data
            console.log(getElementsWithRunOnce(elementsToRemove))
        }

        setElements((els) => removeElements(elementsToRemove, els));
        setDisplayElementDetails(false);

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

    const onElementDoubleClick = (event, element) => {
        selectNode(element)
        setDisplayElementDetails(true);
        setDisplayNodeContextMenu(false);
    }

    const onElementClick = (event, element) => {
        if (onNodeClick) {
            onNodeClick(event, element);
        }
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
        setClientX(event?.clientX - 150);
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

    const handleConfigSave = (value) => {
        currentNode.data.spec.init = value
        handleUpdate()
    }

    const handleRuntimeConfig = (nodeId, value) => {
        if (currentNode.data.spec.id === nodeId) {
            currentNode.data.spec = {...currentNode.data.spec, ...value}

            // Refresh flow node
            if (elements) {
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

    return <>
        <FlowEditorTitle
            flowId={id}
            reactFlowInstance={reactFlowInstance}
            flowMetaData={flowMetaData}
            onDraftRestore={(flow) => {
                updateFlow(flow)
            }}
            onDeploy={() => setDeployed(true)}
            onSaveDraft={() => setModified(false)}
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
                            defaultPosition={[700, 100]} // set position so point (0, 0) is always visible
                            onElementsRemove={onElementsRemove}
                            onElementClick={onElementClick}
                            onNodeDoubleClick={onElementDoubleClick}
                            onEdgeDoubleClick={onElementDoubleClick}
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

                            {displayNodeContextMenu && <div className="NodeContextForm"
                                                            style={{
                                                                left: clientX,
                                                                top: clientY
                                                            }}
                            >
                                {currentNode?.data?.metadata?.desc}
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

                            <StatusTag modified={modified} deployed={deployed}/>

                            <Background color="#444" gap={16}/>
                        </ReactFlow>}
                    </div>

                    {displayElementDetails && currentNode && <DetailsHandler element={currentNode}
                                                                             onEdgeRefresh={(edge) => {
                                                                                 if (elements) {
                                                                                     setRefreshEdgeId([edge.id, edge])
                                                                                 }
                                                                                 handleUpdate()
                                                                             }}
                                                                             onNodeRefresh={(node) => {
                                                                                 if (elements) {
                                                                                     setRefreshNodeId([node.id, node])
                                                                                 }
                                                                                 handleUpdate()
                                                                             }}
                                                                             onNodeConfig={handleConfigSave}
                                                                             onNodeRuntimeConfig={handleRuntimeConfig}
                                                                             onMicroserviceChange={handleUpdate}
                    />}

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
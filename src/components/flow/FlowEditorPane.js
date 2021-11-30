import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ReactFlow, {
    addEdge,
    Background,
    isEdge,
    isNode,
    removeElements
} from "react-flow-renderer";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import FlowNode from "./FlowNode";
import {v4 as uuid4} from "uuid";
import {request} from "../../remote_api/uql_api_endpoint";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import {debug} from "./FlowEditorOps";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import DebugDetails from "./DebugDetails";
import LogsList from "./LogsList";
import {NodeDetails} from "./NodeDetails";
import InfoEdge from "./edges/InfoEdge";
import StopEdge from "./edges/StopEdge";
import CancelEdge from "./edges/CancelEdge";
import BoldEdge from "./edges/BoldEdge";
import {NodeInitForm} from "../elements/forms/NodeInitForm";
import WfSchema from "./WfSchema";

export function FlowEditorPane(
    {
        id,
        reactFlowInstance = null,
        onFlowLoad,
        onEditorReady,
        onChange,
        onEdit,
        onConfig,
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

    const reactFlowWrapper = useRef(null);
    const [flowLoading, setFlowLoading] = useState(false);
    const [currentNode, setCurrentNode] = useState({});
    const [debugNodeId, setDebugNode] = useState(null);
    const [displayRightSidebar, setDisplayRightSidebar] = useState(false);
    const [displayNodeContextMenu, setDisplayNodeContextMenu] = useState(false);
    const [rightSidebarTab, setRightSidebarTab] = useState(0);
    const [animatedEdge, setAnimatedEdge] = useState(null);
    const [elements, setElements] = useState([]);
    const [logs, setLogs] = useState([]);
    const [label, setLabel] = useState({name: "", id: null});
    const [debugInProgress, setDebugInProgress] = useState(false);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);

    const updateFlow = useCallback((data) => {
        if (data) {
            if (onFlowLoad) {
                const payload = {
                    wf_schema: {
                        uri:   data?.wf_schema?.uri,
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

    useEffect(() => {
        setFlowLoading(true);
        request({
                url: ((draft) ? "/flow/draft/" : "/flow/production") + id,
            },
            setFlowLoading,
            (e) => {
                if (e) {
                    if (showAlert) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                    } else {
                        alert(e[0].msg)
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
                        if(el?.style?.stroke === '#ad1457') {
                            const { stroke, ...newStyle } = el.style
                            el.style = newStyle
                        }

                    } else if (el.id === animatedEdge) {
                        el.style = {
                            stroke: '#ad1457'
                        }
                    } else {
                        if(el?.style?.stroke === '#ad1457') {
                            const { stroke, ...newStyle } = el.style
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

    const onLoad = (reactFlowInstance) => {
        reactFlowInstance.fitView();
        onEditorReady(reactFlowInstance)
    };

    const onDebug = () => {
        setDebugNode(null);
        setAnimatedEdge(null);
        setRightSidebarTab(1);
        setDisplayNodeContextMenu(false);
        debug(
            id,
            reactFlowInstance,
            (e) => showAlert(e),
            setDebugInProgress,
            ({elements, logs}) => {
                setElements(elements);
                setLogs(logs);
                setDisplayRightSidebar(true);
            }
        )
    }

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
        if (onChange) {
            onChange();
        }
    }

    const onDebugClick = (data) => {
        if (onDebug) {
            onDebug(data)
        }
    }

    const onConnect = (params) => {
        setElements((els) => addEdge(params, els));
        setDisplayNodeContextMenu(false);
        if (onChange) {
            onChange();
        }
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
            if (onChange) {
                onChange();
            }
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
        console.log(event)
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
        if (onConfig) {
            onConfig()
        }
    }

    const onConnectionDetails = (nodeId, edgeId) => {
        setDebugNode(nodeId)
        setAnimatedEdge(edgeId);
    }

    const onEditClick = (data) => {
        if (onEdit) {
            onEdit(data);
        }
    }

    const handleLabelSet = (label) => {
        if (elements) {
            setLabel({id: currentNode.id, name: label})
        }
        if (onConfig) {
            onConfig()
        }
    }

    return <div className="FlowPane" ref={reactFlowWrapper}>
        {flowLoading && <CenteredCircularProgress/>}
        {elements && <ReactFlow
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
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            snapToGrid={true}
            snapGrid={snapGrid}
            nodesDraggable={!locked}
            style={{background: "white"}}
            defaultZoom={1}
        >
            <SidebarLeft onEdit={onEditClick}
                     onDebug={onDebugClick}
                     debugInProgress={debugInProgress}
            />
            {displayRightSidebar && <SidebarRight
                defaultTab={rightSidebarTab}
                onTabSelect={setRightSidebarTab}
                inspectTab={<NodeDetails
                    onLabelSet={handleLabelSet}
                    node={currentNode}
                    onConfig={onConfigSave}
                />}
                debugTab={<DebugDetails
                    nodes={elements}
                    node={currentNode}
                    onConnectionDetails={onConnectionDetails}
                />}
                logTab={
                    <LogsList logs={logs}/>
                }
            />
            }
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
            <WfSchema schema={schema} style={{position: "absolute" , bottom:5, right:10, fontSize: "80%"}}/>
            <Background color="#444" gap={16}/>
        </ReactFlow>}
    </div>
}

FlowEditorPane.propTypes = {
    id: PropTypes.string.isRequired,
    onFlowLoad: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
    onChange: PropTypes.func,
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
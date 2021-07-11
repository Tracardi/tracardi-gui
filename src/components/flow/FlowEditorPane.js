import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ReactFlow, {addEdge, Background, isEdge, removeElements} from "react-flow-renderer";
import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import FlowNode from "./FlowNode";
import {v4 as uuid4} from "uuid";
import {request} from "../../remote_api/uql_api_endpoint";
import Sidebar from "./Sidebar";
import NodeDetails from "./NodeDetails";
import {debug} from "./FlowEditorOps";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";

export function FlowEditorPane(
    {
        id,
        title,
        reactFlowInstance = null,
        onFlowLoad,
        onFlowLoadError,
        onEditorReady,
        onChange,
        onEdit,
        onConfig,
        locked = false,
        draft = true,
        showAlert
    }) {

    const snapGrid = [20, 20];
    const nodeTypes = {
        flowNode: FlowNode
    };

    const reactFlowWrapper = useRef(null);
    const [flowLoading, setFlowLoading] = useState(false);
    const [currentNode, setCurrentNode] = useState({});
    const [displayDetails, setDisplayDetails] = useState(false);
    const [animatedEdge, setAnimatedEdge] = useState(null);
    const [elements, setElements] = useState(null);

    useEffect(() => {
        setFlowLoading(true);
        request({
                url: ((draft) ? "/flow/draft/" : "/flow/") + id,
            },
            setFlowLoading,
            (e) => {
                if (e) {
                    if (onFlowLoadError) {
                        onFlowLoadError({message: e[0].msg, type: "error", hideAfter: 4000});
                    } else {
                        alert(e[0].msg)
                    }
                }
            },
            (response) => {
                updateFlow(response?.data);
            })
    }, [id, draft])

    useEffect(() => {
        if(elements) {
            setElements((els) => els.map((el) => {
                    if (isEdge(el)) {
                        if (animatedEdge === null && el.animated === true) {
                            el.animated = false;
                        } else if (el.id === animatedEdge) {
                            el.animated = true;
                        } else {
                            el.animated = false;
                        }
                    }
                    return el;
                })
            );
        }
    }, [animatedEdge])

    const updateFlow = (data) => {
        if (data) {
            if (onFlowLoad) {
                const payload = {
                    name: data?.name,
                    description: data?.description,
                    enabled: data?.enabled,
                    projects: data?.projects,
                }
                onFlowLoad(payload);
                locked = data.lock
            }

            let flowGraph = []
            if (data?.flowGraph) {
                flowGraph = data.flowGraph.nodes.slice();
                flowGraph = flowGraph.concat(data.flowGraph.edges.slice())
            }
            setElements(flowGraph);
        } else if (data === null) {
            // Missing flow
            if (onFlowLoadError) {
                onFlowLoadError({message: "This workflow is missing", type: "warning", hideAfter: 2000});
            } else {
                alert("This workflow is missing")
            }
        }
    }

    const onLoad = (reactFlowInstance) => {
        onEditorReady(reactFlowInstance)
    };

    const onDebug = () => {
        debug(
            id,
            reactFlowInstance,
            (e) => showAlert(e),
            () => {
            },
            (elements) => setElements(elements)
        )
    }

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
        if (onChange) {
            onChange();
        }
    }

    const onDebugClick = (data) => {
        if(onDebug) {
            onDebug(data)
        }
    }

    const onConnect = (params) => {
        setElements((els) => addEdge(params, els));
        if (onChange) {
            onChange();
        }
    }

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
        if (onChange) {
            onChange();
        }
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onNodeDoubleClick = (event, element) => {
        if (onDisplayDetails) {
            onDisplayDetails(element);
        }
    }

    const onElementClick = (event, element) => {
        if (onNodeClick) {
            onNodeClick(element);
        }
    }

    const onPaneClick = () => {
        setDisplayDetails(false);
        setAnimatedEdge(null);
    }

    const onNodeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
        setDisplayDetails(false);
    }

    const onNodeClick = (element) => {
        setCurrentNode(element);
        if(element.data?.debugging && Array.isArray(element.data?.debugging)
            && element.data?.debugging.length>0 && element.data?.debugging[0]?.edge?.id) {
            setAnimatedEdge(element.data.debugging[0].edge.id);
        } else {
            setAnimatedEdge(null);
        }
    }
    const onDisplayDetails = (element) => {
        setCurrentNode(element);
        setDisplayDetails(true);
    }

    const onConfigSave = () => {
        onConfig()
    }

    const onConnectionDetails = (edge_id) => {
        setAnimatedEdge(edge_id);
    }

    const onEditClick =(data)=> {
        if(onEdit) {
            onEdit(data);
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
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            deleteKeyCode={46}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            snapToGrid={true}
            snapGrid={snapGrid}
            nodesDraggable={!locked}
            style={{background: "white"}}
            defaultZoom={1}
        >
            {title}
            <Sidebar onEdit={onEditClick}
                     onDebug={onDebugClick}/>
            {displayDetails && <NodeDetails
                node={currentNode}
                onConfig={onConfigSave}
                onConnectionDetails={onConnectionDetails}
            />}
            <Background color="#444" gap={16}/>
        </ReactFlow>}
    </div>
}

FlowEditorPane.propTypes = {
    id: PropTypes.string.isRequired,
    onFlowLoad: PropTypes.func.isRequired,
    onFlowLoadError: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    elements: PropTypes.array,
    setElements: PropTypes.func.isRequired,
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
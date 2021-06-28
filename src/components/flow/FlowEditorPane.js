import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ReactFlow, {addEdge, Background, Controls, isNode, removeElements} from "react-flow-renderer";
import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import FlowNode from "./FlowNode";
import {v4 as uuid4} from "uuid";
import {request} from "../../remote_api/uql_api_endpoint";

export function prepareFlowPayload(id, flowMetaData, reactFlowInstance) {

    const flow = reactFlowInstance.toObject();
    let payload = {
        id: id,
        name: flowMetaData.name,
        description: flowMetaData.description,
        enabled: flowMetaData.enabled,
        flowGraph: {
            nodes: [],
            edges: []
        },
        projects: flowMetaData.projects
    }

    flow.elements.map((element) => {
        if (isNode(element)) {
            return payload.flowGraph.nodes.push(element)
        } else {
            return payload.flowGraph.edges.push(element)
        }
    });

    return payload;
}

export function save(id, flowMetaData, reactFlowInstance, onError, onReady, progress, deploy=false) {
    const payload = prepareFlowPayload(id, flowMetaData, reactFlowInstance)
    progress(true);
    request(
        {
            url: (deploy === false) ? "/flow/draft" : "/flow",
            method: "POST",
            data: payload
        },
        progress,
        (e) => {
            if (e) {
                onError({message: e[0].msg, type: "error", hideAfter: 2000});
            }
        },
        (data) => {
            if (data) {
                onReady(data);
            }
        }
    )
}

export function debug(id, reactFlowInstance, onError, progress, onReady) {
    progress(true);
    request(
        {
            url: "/flow/" + id + "/debug",
            method: "POST",
        },
        progress,
        (e) => {
            if (e) {
                onError({message: e[0].msg, type: "error", hideAfter: 2000});
            }
        },
        (data) => {
            if (data) {
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
                onReady(flow.elements || []);
            }
        }
    )
}

export default function FlowEditorPane({
                                           id,
                                           onDisplayDetails,
                                           onHideDetails,
                                           onNodeClick,
                                           onFlowLoad,
                                           onFlowLoadError,
                                           onEditorReady,
                                           locked = false,
                                           draft = true
                                       }) {

    const snapGrid = [20, 20];
    const nodeTypes = {
        flowNode: FlowNode
    };

    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(null);
    const [flowLoading, setFlowLoading] = useState(false);


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
                onFlowLoadError({message: "This work flow is missing", type: "warning", hideAfter: 2000});
            } else {
                alert("This work flow is missing")
            }
        }
    }

    const onLoad = (reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
        onEditorReady(reactFlowInstance)
    };

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
    }

    const onConnect = (params) => {
        setElements((els) => addEdge(params, els));
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
        if (onHideDetails) {
            onHideDetails();
        }
    }

    const onNodeContextMenu = (event, element) => {
        event.preventDefault();
        event.stopPropagation();
        if (onHideDetails) {
            onHideDetails(element);
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
            <Controls/>
            <Background color="#555" gap={16}/>
        </ReactFlow>}
    </div>
}

FlowEditorPane.propTypes = {
    id: PropTypes.string.isRequired,
    onDisplayDetails: PropTypes.func.isRequired,
    onHideDetails: PropTypes.func.isRequired,
    onNodeClick: PropTypes.func.isRequired,
    onFlowLoad: PropTypes.func.isRequired,
    onFlowLoadError: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
    locked: PropTypes.bool,
    draft: PropTypes.bool
};
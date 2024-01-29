import {getFlowDebug} from "../../remote_api/endpoints/flow";
import {getError} from "../../remote_api/entrypoint";

export function prepareGraph(reactFlowInstance) {
    const flow = reactFlowInstance.toObject();
    let graph = {
        nodes: [],
        edges: []
    }

    flow.nodes.map((node) => {
        return graph.nodes.push(node)
    })
    flow.edges.map((edge) => {
        edge.type = "";
        return graph.edges.push(edge)
    })

    return graph;
}

export function prepareFlowPayload(id, flowMetaData, reactFlowInstance) {
    return {
        id: id,
        wf_schema: {
            uri: flowMetaData?.wf_schema?.uri,
            version: flowMetaData?.wf_schema?.version
        },
        timestamp:flowMetaData?.timestamp || null,
        deploy_timestamp:flowMetaData?.deploy_timestamp || null,
        name: flowMetaData?.name,
        description: flowMetaData?.description,
        flowGraph: prepareGraph(reactFlowInstance),
        projects: flowMetaData?.projects,
        type: flowMetaData.type
    }
}

export function save(id, flowMetaData, reactFlowInstance, onError, onReady, progress, request) {

    const payload = prepareFlowPayload(id, flowMetaData, reactFlowInstance)
    progress(true);
    request({
        url: "/flow/draft",
        method: "POST",
        data: payload
    }).then((response) => {
        if (response) {
            onReady(response?.data);
        }
    }).catch((e) => {
        if (e) {
            e = getError(e)
            if(e.length > 0) {
                onError({message: e[0].msg, type: "error", hideAfter: 2000});
            }
        }
    }).finally(()=> {
        progress(false);
    })
}

export function debug(id, eventId, reactFlowInstance, onError, progress, onReady, request) {
    const endpoint = getFlowDebug(eventId)

    progress(true);

    request({
            ...endpoint,
            data: {
                id: id,
                name: "Name is not set in debug mode",
                description: "Description is not set in debug mode",
                flowGraph: prepareGraph(reactFlowInstance),
                projects: [],
            }
    }).then((response) => {

        if (response) {
            const flow = reactFlowInstance.toObject();

            flow.nodes.map((node) => {
                node.data = {
                    ...node.data,
                    debugging: {
                        node: {},
                        edge: {}
                    }
                }

                if (response?.data?.debugInfo?.nodes[node.id]) {
                    node.data.debugging = {
                        ...node.data.debugging,
                        node: response.data.debugInfo.nodes[node.id]
                    }
                } else {
                    delete node.data.debugging
                }

                return node
            })

            flow.edges.map((edge) => {
                edge.data = {
                    ...edge.data,
                    debugging: {
                        node: {},
                        edge: {}
                    }
                }

                if (response?.data?.debugInfo?.edges) {
                    const edge_info = response.data?.debugInfo?.edges[edge.id]
                    if (edge_info) {
                        edge.data.debugging = {
                            ...edge.data.debugging,
                            edge: edge_info
                        }
                        if (edge_info.active.includes(false) && !edge_info.active.includes(true)) {
                            edge.label = null
                            edge.type = "stop";
                            edge.animated = false;
                            edge.style = {...edge.style, stroke: '#aaa', strokeWidth: 2}
                        } else if (edge_info.active.includes(true) && !edge_info.active.includes(false)) {
                            edge.label = null
                            edge.animated = true
                            edge.style = {...edge.style, stroke: 'green', strokeWidth: 2};
                            edge.type = "info";
                        } else {
                            edge.label = null
                            edge.animated = true
                            edge.style = {...edge.style, stroke: '#aaa', strokeWidth: 2}
                            edge.type = null;
                        }
                    } else {
                        // no debug info
                        edge.label = null
                        edge.animated = false
                        edge.style = {
                            ...edge.style,
                            stroke: '#ddd',
                            strokeWidth: 1
                        };
                        edge.type = "cancel";
                    }
                } else {
                    console.error("DebugInfo.edges missing in server response.")
                }

                return edge
            })

            onReady({
                nodes: flow.nodes || [],
                edges: flow.edges || [],
                logs: response?.data?.logs
            });
        }
    }).catch(e => {
        if (e) {
            e = getError(e)
            onError({message: e[0].msg, type: "error", hideAfter: 5000});
        }
    }).finally(
        progress(false)
    )
}
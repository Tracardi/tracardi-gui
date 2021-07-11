import {isNode} from "react-flow-renderer";
import {request} from "../../remote_api/uql_api_endpoint";

export function prepareGraph(reactFlowInstance) {
    const flow = reactFlowInstance.toObject();
    let graph = {
        nodes: [],
        edges: []
    }

    flow.elements.map((element) => {
        if (isNode(element)) {
            return graph.nodes.push(element)
        } else {
            return graph.edges.push(element)
        }
    });
    return graph;
}

export function prepareFlowPayload(id, flowMetaData, reactFlowInstance) {
    return {
        id: id,
        name: flowMetaData.name,
        description: flowMetaData.description,
        enabled: flowMetaData.enabled,
        flowGraph: prepareGraph(reactFlowInstance),
        projects: flowMetaData.projects
    }
}

export function save(id, flowMetaData, reactFlowInstance, onError, onReady, progress, deploy = false) {
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
            url: "/flow/debug",
            method: "POST",
            data: {
                id: id,
                name: "Name is not set in debug mode",
                description: "Description is not set in debug mode",
                enabled: true,
                flowGraph: prepareGraph(reactFlowInstance),
                projects: []
            }
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
                        if (data.data?.debugInfo?.nodes[element.id]) {
                            element.data['debugging'] = {
                                node: data.data.debugInfo.nodes[element.id]
                            }
                        } else {
                            delete element.data.debugging
                        }
                    }
                    return element;
                });
                onReady(flow.elements || []);
            }
        }
    )
}
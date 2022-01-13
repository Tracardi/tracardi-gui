import {isNode} from "react-flow-renderer";

export default function convertNodesToProfilingData(nodes) {

    let profilingData = {
        startTime: 0,
        endTime: 0,
        calls: []
    }

    nodes.map((node) => {
        if (isNode(node)) {
            if (node.data?.debugging?.node?.calls) {
                node.data?.debugging?.node?.calls.map((call) => {
                    if (call.run === true) {
                        profilingData.calls.push(
                            {
                                id: node.id,
                                sq: node.data?.debugging?.node?.executionNumber,
                                error: call.error !== null,
                                name: node.data?.debugging?.node?.name,
                                startTime: call.profiler.startTime,
                                runTime: call.profiler.runTime,
                                endTime: call.profiler.endTime,
                                call: {
                                    input: call.input,
                                    output: call.output,
                                    error: call.error,
                                    profile: call.profile,
                                    event: call.event,
                                    session: call.session
                                }
                            }
                        )
                    }

                    return null;
                })
            }
        }
        return null;
    });
    return profilingData
}

export function convertDebugInfoToProfilingData(debugInfo) {

    let profilingData = {
        startTime: 0,
        endTime: 0,
        calls: []
    }

    if(debugInfo?.nodes) {
        Object.entries(debugInfo.nodes).map(([key, node]) => {
            if (isNode(node)) {
                if (node.calls) {
                    node.calls.map((call) => {
                        if (call.run === true) {
                            profilingData.calls.push(
                                {
                                    id: node.id,
                                    sq: node.executionNumber,
                                    error: call.error !== null,
                                    name: node.name,
                                    startTime: call.profiler.startTime,
                                    runTime: call.profiler.runTime,
                                    endTime: call.profiler.endTime,
                                    call: {
                                        input: call.input,
                                        output: call.output,
                                        error: call.error,
                                        profile: call.profile || {},
                                        event: call.event || {},
                                        session: call.session || {}
                                    }
                                }
                            )
                        }

                        return null;
                    })
                }
            }
            return null;
        });
    }

    return profilingData
}

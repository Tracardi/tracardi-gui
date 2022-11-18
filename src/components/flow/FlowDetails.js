import FlowNode from "./FlowNode";
import FlowNodeWithEvents from "./FlowNodeWithEvents";
import StartNode from "./StartNode";
import CondNode from "./CondNode";
import React, {Suspense, useEffect, useState} from "react";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {Background} from "react-flow-renderer";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";

const ReactFlow = React.lazy(() => import('react-flow-renderer'))

export function FlowDisplay({showAlert, id}) {

    const nodeTypes = {
        flowNode: FlowNode,
        flowNodeWithEvents: FlowNodeWithEvents,
        startNode: StartNode,
        condNode: CondNode
    };

    const [elements, setElements] = useState(null);
    const [flowLoading, setFlowLoading] = useState(false);

    useEffect(() => {
        setFlowLoading(true);
        let isSubscribed = true;

        asyncRemote({
            url: "/flow/production/" + id,
        }).then(response => {
            if (response && isSubscribed === true) {
                let flowGraph = []
                if (response?.data?.flowGraph) {
                    flowGraph = response?.data?.flowGraph.nodes.slice();
                    flowGraph = flowGraph.concat(response?.data?.flowGraph.edges.slice())
                }
                setElements(flowGraph);
            }
        }).catch(e => {
            if (e && isSubscribed === true) {
                const errors = getError(e)
                showAlert({message: errors[0].msg, type: "error", hideAfter: 4000});
            }
        }).finally(() => {
            if (isSubscribed === true) setFlowLoading(false)
        })

        return () => {
            isSubscribed = false
        }
    }, [id, showAlert])

    return <div style={{flex: 1, height: "inherit"}}>
        {flowLoading && <CenteredCircularProgress/>}
        {elements && <Suspense fallback={<CenteredCircularProgress/>}>
            <ReactFlow
                elements={elements}
                zoomOnDoubleClick={false}
                zoomOnScroll={false}
                panOnScroll={true}
                snapToGrid={true}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                style={{background: "white"}}
                defaultZoom={1}
            >
                <Background color="#555" gap={16}/>
            </ReactFlow>
        </Suspense>}
    </div>
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowDisplay)
import ReactFlow, {Background} from "react-flow-renderer";
import React, {useEffect, useState} from "react";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import FlowNode from "./FlowNode";
import FlowNodeWithEvents from "./FlowNodeWithEvents";
import StartNode from "./StartNode";
import {asyncRemote, getError} from "../../remote_api/entrypoint";

export function FlowReader({showAlert}) {

    let {id} = useParams();

    const nodeTypes = {
        flowNode: FlowNode,
        flowNodeWithEvents: FlowNodeWithEvents,
        startNode: StartNode
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
            if(isSubscribed === true) setFlowLoading(false)
        })

        return () => {
            isSubscribed = false
        }
    }, [id, showAlert])

    return <div style={{flex: 1, height: "inherit"}}>
        {flowLoading && <CenteredCircularProgress/>}
        {elements && <ReactFlow
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
        </ReactFlow>}
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
)(FlowReader)
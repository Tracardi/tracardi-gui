import ReactFlow, {Background} from "react-flow-renderer";
import React, {useEffect, useState} from "react";
import {request} from "../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import FlowNode from "./FlowNode";
import FlowNodeWithEvents from "./FlowNodeWithEvents";
import StartNode from "./StartNode";

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
        request({
                url: "/flow/production/" + id,
            },
            setFlowLoading,
            (e) => {
                if (e) {
                   showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            },
            (response) => {
                let flowGraph = []
                if (response?.data?.flowGraph) {
                    flowGraph = response?.data?.flowGraph.nodes.slice();
                    flowGraph = flowGraph.concat(response?.data?.flowGraph.edges.slice())
                }
                setElements(flowGraph);
            })
    }, [id, showAlert])

    return <div style={{flex: 1,height: "inherit"}}>
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
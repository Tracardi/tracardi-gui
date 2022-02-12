import React from 'react';
import {
    getBezierPath,
    getEdgeCenter,
    getMarkerEnd,
} from 'react-flow-renderer';
import {BiPlayCircle} from "react-icons/bi";

const foreignObjectSize = 20;

const onEdgeClick = (evt, id) => {
    // evt.stopPropagation();  // Stoped propagation stops selecting egde by clicking on icon
    // todo action
};

export default function InfoEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       sourcePosition,
                                       targetPosition,
                                       style = {},
                                       arrowHeadType,
                                       markerEndId,
                                   }) {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <path className="react-flow__edge-path-selector" d={edgePath} markerEnd={markerEnd} fillRule="evenodd" />
            <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} fillRule="evenodd" />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <BiPlayCircle size={foreignObjectSize} style={{backgroundColor: "white", color:"green", cursor: "pointer"}} onClick={(event) => onEdgeClick(event, id)}/>
            </foreignObject>
        </>
    );
}
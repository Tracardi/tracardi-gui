import React from 'react';
import {
    getBezierPath,
    getMarkerEnd,
} from 'react-flow-renderer';


export default function BoldEdge({
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

    return (
        <>
            <path className="react-flow__edge-path-selector" d={edgePath} markerEnd={markerEnd} fillRule="evenodd" />
            <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} fillRule="evenodd" />
        </>
    );
}
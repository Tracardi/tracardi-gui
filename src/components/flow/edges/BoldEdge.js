import React from 'react';
import {
    EdgeText,
    getBezierPath, getEdgeCenter,
    getMarkerEnd,
} from 'react-flow-renderer';

const BoldEdge = React.memo(({
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
                                 data
                             }) => {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const [centerX, centerY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <path className="react-flow__edge-path-selector" d={edgePath} markerEnd={markerEnd} fillRule="evenodd"/>
            <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd}
                  fillRule="evenodd"/>
            {data?.name && <EdgeText
                style={{cursor: "pointer"}}
                x={centerX}
                y={centerY}
                label={data.name}
                labelBgPadding={[6, 3]}
                labelBgBorderRadius={4.8}/>}
        </>
    );
})

export default BoldEdge;
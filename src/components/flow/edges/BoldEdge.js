import React from 'react';
import {
    EdgeText,
    getBezierPath,
    getMarkerEnd,
} from 'reactflow';

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
    const [edgePath, centerX, centerY] = getBezierPath({
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
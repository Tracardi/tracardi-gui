import React from 'react';
import {
    EdgeText,
    getBezierPath,
    getEdgeCenter,
    getMarkerEnd,
} from 'react-flow-renderer';
import {AiOutlineCloseCircle} from "react-icons/ai";

const foreignObjectSize = 19;

const CancelEdge = ({
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
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={centerX - foreignObjectSize / 2}
                y={centerY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <AiOutlineCloseCircle size={foreignObjectSize} style={{backgroundColor: "white", color: "#aaa", cursor: "pointer"}}/>
            </foreignObject>
            {data?.name && <EdgeText
                style={{cursor: "pointer"}}
                x={centerX}
                y={centerY + foreignObjectSize - 1}
                label={data.name}
                labelBgPadding={[6, 3]}
                labelBgBorderRadius={4.8}/>}
        </>
    );
}

export default React.memo(CancelEdge)
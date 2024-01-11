import React from 'react';
import {
    EdgeText,
    getBezierPath,
    getMarkerEnd,
} from 'reactflow';
import {AiOutlineCloseCircle} from "react-icons/ai";
import useTheme from "@mui/material/styles/useTheme";

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
    const [edgePath, centerX, centerY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const theme = useTheme()

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
                <AiOutlineCloseCircle size={foreignObjectSize} style={{
                    backgroundColor: theme.palette.common.white,
                    color: "#aaa",
                    cursor: "pointer",
                    borderRadius: "50%"}}/>
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
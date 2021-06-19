import React from "react";
import './NodeDebugConsole.css';
import ActionDebugBox from "./ActionDebugBox";

export default function NodeDebugConsole({nodes}) {

    return <>
        <div className="Debug">
            <div className="DebugTitle">
                <span>
                <span style={{marginRight: 5, fontWeight: 600}}>Debug</span> console </span>
                <span className="Description">
                    Please click on action/node on the graph to see its data.
                </span>
            </div>

            <div className="RowContent">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <span style={{textTransform: "uppercase", marginLeft: 10, fontSize: 16}}>Debug info</span>
                </div>
                <ActionDebugBox calls={nodes}/>
            </div>
        </div>
    </>
}
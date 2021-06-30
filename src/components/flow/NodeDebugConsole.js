import React from "react";
// import './NodeDebugConsole.css';
import ActionDebugBox from "./ActionDebugBox";

export default function NodeDebugConsole({nodes}) {
    return <ActionDebugBox calls={nodes}/>
}
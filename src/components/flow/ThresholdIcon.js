import "./ThresholdIcon.css";
import React from "react";

export default function ThresholdIcon({style}) {
    style={...style, position: "absolute", whiteSpace: "nowrap", top: -30}
    return <div className="ThresholdIcon" style={style}>
        Run on change
    </div>
}
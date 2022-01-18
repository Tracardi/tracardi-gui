import "./ThresholdIcon.css";
import {BsStopwatch} from "react-icons/bs";
import React from "react";

export default function ThresholdIcon() {
    return <div className="ThresholdIcon">
        <BsStopwatch size={20} style={{marginRight: 4}}/> Conditional stop
    </div>
}
import React from "react";
import "./RightPaperHeader.css";
import {HighlightOff} from "@material-ui/icons";

function RightPaperHeader({children, onClose}) {
    return <div className="RightPaperHeader">
        <span className="Label">{children}</span>
        <HighlightOff onClick={onClose} style={{cursor: "pointer"}}/>
    </div>
};

export default RightPaperHeader
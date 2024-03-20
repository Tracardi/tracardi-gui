import {VscDebugAlt} from "react-icons/vsc";
import React from "react";
import './FlowEditorButtons.css'
import IconButton from "../elements/misc/IconButton";

export function FlowEditorIcons({onDebug, debugInProgress}) {
    return (
        <div className="FlowEditorButtons">
            <IconButton label="Debug" onClick={onDebug} progress={debugInProgress} size="large">
                <VscDebugAlt size={20}/>
            </IconButton>
        </div>
    );
}
import React from "react";
import './FlowEditorBottomLine.css';
import {AiOutlinePlusCircle} from "react-icons/ai";
import {AiOutlineMinusCircle} from "react-icons/ai";
import {BsPencil} from "react-icons/bs";
import {VscDebugAlt} from "react-icons/vsc";
import useTheme from "@mui/material/styles/useTheme";

export const FlowEditorBottomLine = ({onDebug, onEdit, onZoomIn, onZoomOut}) => {

    const theme = useTheme()

    const style = {
        backgroundColor: theme.palette.common.white
    }

    return <div className="FlowEditorBottomLine" style={style}>
        <span onClick={onZoomIn} style={{display: "inline-flex", alignItems: "center"}}>
            <AiOutlinePlusCircle size={20} style={{marginRight: 5}}/> Zoom-in
        </span>
        <span onClick={onZoomOut} style={{display: "inline-flex", alignItems: "center"}}>
            <AiOutlineMinusCircle size={20} style={{marginRight: 5}}/> Zoom-out
        </span>
        <span onClick={onEdit} style={{display: "inline-flex", alignItems: "center"}}>
             <BsPencil size={20} style={{marginRight: 5}}/> Edit
        </span>
        <span onClick={onDebug} style={{display: "inline-flex", alignItems: "center"}}>
             <VscDebugAlt size={20} style={{marginRight: 5}}/> Debug
        </span>
    </div>
}
import React from "react";
import {RiExchangeFundsFill} from "@react-icons/all-files/ri/RiExchangeFundsFill";
import {TiTickOutline} from "@react-icons/all-files/ti/TiTickOutline";
import {BsToggleOn} from "@react-icons/all-files/bs/BsToggleOn";
import {BsToggleOff} from "@react-icons/all-files/bs/BsToggleOff";
import "./FlowEditorTitle.css";

export default function FlowEditorTitle({title, modified, deployed, onSave, onDeploy}) {

    const Saved = ({onClick}) => {
        const button = () => (modified)
            ? <span className="AlertTag"><RiExchangeFundsFill size={20} style={{marginRight: 5}}/>Modified</span>
            : <span className="OKTag"><TiTickOutline size={20} style={{marginRight: 5}}/>Saved</span>

        return <span onClick={onClick} style={{cursor: "pointer"}}>{button()}</span>
    }

    const Deployed = ({onClick}) => {
        const button = () => (deployed)
            ? <span className="OKTag"><BsToggleOn size={20} style={{marginRight: 5}}/>Deployed</span>
            : <span className="AlertTag"><BsToggleOff size={20} style={{marginRight: 5}}/>Draft</span>

        return <span onClick={onClick} style={{cursor: "pointer"}}>{button()}</span>
    }

    return <aside className="FlowEditorTitle">
        <Saved onClick={onSave}/>
        <Deployed onClick={onDeploy}/>
        <span style={{marginLeft: 10}}>{title}</span>
    </aside>
}
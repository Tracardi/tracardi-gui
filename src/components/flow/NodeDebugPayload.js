import React, {useState} from "react";
import './NodeDebugWindow.css';
import {VscDebug} from "react-icons/vsc";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import Button from "../elements/forms/Button";
import getEventPayload from "./payload";

export default function NodeDebugPayload({onDebug}) {

    const initPayload = () => {
        return JSON.stringify(getEventPayload(
            "source_id",
            "profile_id",
            "session_id",
            "event_type",
            {property1: 1, property2: 2}
        ), null, '  ')
    }

    const [eventPayload, setEventPayload] = useState(initPayload)

    const _onDebug = (event) => {
        const _event = JSON.parse(event);
        onDebug(_event);
    }

    const renderEventPayload = () => {
        return <>
            <span>
                <span style={{marginRight: 5, fontWeight: 600}}>Event payload</span> console
            </span>
            <span className="Description">Please provide event payload you want to debug with.</span>
            <span>
                <Button onClick={() => _onDebug(eventPayload)}
                            label="Debug"
                            icon={<VscDebug size={15} style={{marginRight: 5}}/>}
                            style={{fontSize: 12, margin: 0, padding: 5}}
                    >
                </Button>
            </span>
        </>
    }

    const renderEditor = () => {
        return <AceEditor
            mode="json"
            theme="tomorrow"
            fontSize={14}
            // onLoad={(d)=>console.log(d)}
            onChange={(d) => setEventPayload(d)}
            name="payload_editor"
            value={eventPayload}
            editorProps={{$blockScrolling: true}}
            width="100%"
            height="220px"
        />
    }

    return <div className="PayloadDebug">
            <div className="PayloadDebugTitle">
                {renderEventPayload()}
            </div>
            <div className="PayloadDebugContent">
                {renderEditor()}
            </div>
        </div>
}
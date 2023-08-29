import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"
import "./JsonEditor.css";

import React, {Suspense, useEffect, useRef} from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ReferencedJsonMode from "./highlight/references";
import {getValueIfExists} from "../../../misc/values";

const AceEditor = React.lazy(() => import('react-ace'))

export default function JsonEditor({onChange, value, height, autocomplete = false}) {

    const aceEditor = useRef();

    useEffect(() => {
        if (aceEditor.current) {
            aceEditor.current.editor.getSession().setMode(new ReferencedJsonMode())
        }
    }, [aceEditor.current])

    let options = {
        useWorker: false
    }

    if (autocomplete) {
        options = {
            useWorker: false,
            enableBasicAutocompletion: [{
                getCompletions: (editor, session, pos, prefix, callback) => {
                    callback(null, [
                        {value: 'payload@', score: 1, meta: 'Payload data reference'},
                        {value: 'event@', score: 2, meta: 'Event data reference'},
                        {value: 'session@', score: 3, meta: 'Session data reference'},
                        {value: 'profile@', score: 4, meta: 'Profile data reference'},
                        {value: 'flow@', score: 5, meta: 'Flow data reference'},
                        {value: 'memory@', score: 6, meta: 'Memory data reference'},
                    ]);
                },
            }],
            enableSnippets: false,
            enableLiveAutocompletion: true
        }
    }

    return <Suspense fallback={<CenteredCircularProgress/>}>
        <AceEditor
            mode="json"
            theme="tomorrow"
            ref={aceEditor}
            fontSize={16}
            // onLoad={(d)=>console.log(d)}
            onChange={onChange}
            name="payload_editor"
            value={typeof value === 'string' ? value : ""}
            editorProps={{$blockScrolling: true}}
            width="100%"
            height={height ? height : "260px"}
            setOptions={options}
            commands={[{   // commands is array of key bindings.
                name: 'Help', //name for the key binding.
                bindKey: {win: 'Ctrl-h', mac: 'Command-h'}, //key combination used for the command.
                exec: () => {
                    console.log('key-binding used')
                }  //function to execute when keys are pressed.
            }]}
        />
    </Suspense>
}


export function JsonEditorField({onChange, label, value, height, autocomplete = false, errorMessage}) {

    let borderStyle = {};
    let labelStyle = {};

    if (errorMessage) {
        borderStyle = {borderColor: "#d81b60"}
        labelStyle = {color: "#d81b60"}
    }

    return <>
        <fieldset style={{...borderStyle, marginTop: 10}}>
            <legend style={labelStyle}>{label}</legend>
            <JsonEditor value={value} onChange={onChange} height={height} autocomplete={autocomplete}/>
        </fieldset>
        {errorMessage && <span style={{...labelStyle, fontSize: 12}}>{errorMessage}</span>}
    </>
}
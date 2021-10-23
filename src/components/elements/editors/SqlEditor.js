import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-tomorrow";
import React from "react";

export default function SqlEditor({onChange, value, height}) {

    return <AceEditor
        mode="sql"
        theme="tomorrow"
        fontSize={16}
        // onLoad={(d)=>console.log(d)}
        onChange={onChange}
        name="sql_editor"
        value={value}
        editorProps={{$blockScrolling: true}}
        width="100%"
        height={height ? height : "260px"}
        setOptions={{
            useWorker: false
        }}
    />
}

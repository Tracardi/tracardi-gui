import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-tomorrow";
import React, {Suspense} from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const AceEditor = React.lazy(() => import('react-ace'))

export default function JsonEditor({onChange, value, height}) {

    return <Suspense fallback={<CenteredCircularProgress/>}>
        <AceEditor
            mode="json"
            theme="tomorrow"
            fontSize={16}
            // onLoad={(d)=>console.log(d)}
            onChange={onChange}
            name="payload_editor"
            value={typeof value === 'string' ? value : ""}
            editorProps={{$blockScrolling: true}}
            width="100%"
            height={height ? height : "260px"}
            setOptions={{
                useWorker: false
            }}
        />
    </Suspense>
}

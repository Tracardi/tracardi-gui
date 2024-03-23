import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsClipboardCheck} from "react-icons/bs";
import TestTrackForm from "../elements/forms/TestTrackForm";


export default function TestEditorPage() {

    const urlFunc = useCallback((query) => ('/test' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <div style={{padding: "0 20px"}}><TestTrackForm onSave={close}/>
    </div>, []);
    const detailsFunc = useCallback((id, close) => <div style={{padding: "0 20px"}}><TestTrackForm testId={id}
                                                                                                   onSave={close}/>
        </div>,
        [])

    return <CardBrowser
        label="Tests"
        description="List of registered tests."
        urlFunc={urlFunc}
        buttonLabel="New test"
        buttonIcon={<BsClipboardCheck size={20}/>}
        drawerDetailsWidth={1250}
        detailsFunc={detailsFunc}
        drawerAddTitle="New test"
        drawerAddWidth={1250}
        addFunc={addFunc}
        defaultLayout="rows"
        icon="profile"
        deleteEndpoint='/test/'
        forceMode='no-deployment'
    />
}

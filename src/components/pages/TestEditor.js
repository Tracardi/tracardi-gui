import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsClipboardCheck} from "react-icons/bs";
import TestTrackForm from "../elements/forms/TestTrackForm";


export default function TestEditorPage() {

    const urlFunc = useCallback((query) => ('/users' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <div style={{padding: "0 20px"}}><TestTrackForm onSubmit={close}/></div>, []);
    const detailsFunc = useCallback((id, close) => <div style={{padding: "0 20px"}}><TestTrackForm id={id}
                                                                                                   onSubmit={close}/></div>,
        [])

        return <CardBrowser
            label="Tests"
        description="List of registered tests."
        urlFunc={urlFunc}
        buttonLabel="New test"
        buttonIcon={<BsClipboardCheck size={20}/>}
        drawerDetailsWidth={1200}
        detailsFunc={detailsFunc}
        drawerAddTitle="New test"
        drawerAddWidth={1200}
        addFunc={addFunc}
        defaultLayout="rows"
        icon="profile"
        deleteEndpoint='/test/'
        forceMode='no-deployment'
    />
}

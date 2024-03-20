import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsClipboardCheck} from "react-icons/bs";
import ConfigurationForm from "../elements/forms/ConfigurationForm";


export default function ConfigurationPage() {

    const urlFunc = useCallback((query) => ('/configuration' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <div style={{padding: "0 20px"}}><ConfigurationForm onSubmit={close}/>
    </div>, []);
    const detailsFunc = useCallback((id, close) => <div style={{padding: "0 20px"}}><ConfigurationForm configId={id}
                                                                                                       onSubmit={close}/>
        </div>,
        [])

    return <CardBrowser
        label="Configuration"
        urlFunc={urlFunc}
        buttonLabel="New configuration"
        buttonIcon={<BsClipboardCheck size={20}/>}
        drawerDetailsWidth={1200}
        detailsFunc={detailsFunc}
        drawerAddTitle="New configuration"
        drawerAddWidth={1200}
        addFunc={addFunc}
        defaultLayout="rows"
        icon="profile"
        deleteEndpoint='/configuration/'
        forceMode='no-deployment'
    />
}

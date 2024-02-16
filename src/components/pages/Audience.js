import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import AudienceFormById from "../elements/forms/AudienceForm";


export default function Audience() {

    const urlFunc = useCallback((query) => ('/audience' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <AudienceFormById onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <AudienceFormById audienceId={id} onSubmit={close}/>, [])

    return <CardBrowser
        label="Audience"
        description="List of defined audiences. You may filter this list by audience name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New audience"
        buttonIcon={<VscOrganization size={20}/>}
        drawerDetailsWidth={1200}
        detailsFunc={detailsFunc}
        drawerAddTitle="New audience"
        drawerAddWidth={1250}
        addFunc={addFunc}
        deploymentTable="audience"
        deleteEndpoint="/audience/"
        icon="segment"
    />
}

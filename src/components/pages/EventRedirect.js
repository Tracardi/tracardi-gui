import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {IoArrowRedoOutline} from "react-icons/io5";
import EventRedirectForm from "../elements/forms/EventRedirectForm";
import EventRedirectDetails from "../elements/details/EventRedirectDetails";

export default function EventRedirect() {

    const urlFunc = useCallback((query) => ('/event-redirect' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventRedirectForm
        onSaveComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EventRedirectDetails
        id={id}
        onDeleteComplete={close}
        onEditComplete={close}/>, [])

    return <CardBrowser
        label="Event redirects"
        description="List of event redirects."
        urlFunc={urlFunc}
        buttonLabel="New event redirect"
        buttonIcon={<IoArrowRedoOutline size={20}/>}
        drawerDetailsWidth={700}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event redirect"
        drawerAddWidth={600}
        addFunc={addFunc}
        deleteEndpoint='/event-redirect/'
        deploymentTable='event_redirect'
        icon="redirect"
    />
}

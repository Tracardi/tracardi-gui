import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import {BsBoxArrowInRight} from "react-icons/bs";
import EventSourceForm from "../elements/forms/EventSourceForm";


export default function EventSources() {

    const urlFunc = useCallback((query) => ('/event-sources' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventSourceForm onClose={close} style={{margin: 20}}/>, []);
    const detailsFunc = useCallback((id, close) => <EventSourceDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Event Sources"
        description="Event source opens an API through which you will be able to send data. Click on event source to
        see the Javascript snippet or API URL that you can use to collect data."
        urlFunc={urlFunc}
        buttonLabel="New event source"
        buttonIcon={<BsBoxArrowInRight size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event source"
        drawerAddWidth={800}
        addFunc={addFunc}
        deploymentTable='event_source'
        deleteEndpoint='/event-source/'
        icon="source"
    />
}

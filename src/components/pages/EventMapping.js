import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import EventMappingForm from "../elements/forms/EventMappingForm";
import {BsFolderCheck} from "react-icons/bs";
import EventMappingDetails from "../elements/details/EventMappingDetails";
import EventJourneyTag from "../elements/misc/EventJourneyTag";

export default function EventMapping() {

    const urlFunc= useCallback((query) => ('/event-type/search/mappings'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventMappingForm onSubmit={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventMappingDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])
    const descFunc = useCallback((row) => (<>{row.journey && <EventJourneyTag>{row.journey}</EventJourneyTag>}
        {row.description && <span style={{marginRight: 5}}>{row.description}</span>}</>), [])

    return <CardBrowser
        defaultLayout="rows"
        label="Event mapping and event metadata"
        description="List of event types."
        urlFunc={urlFunc}
        buttonLabel="New mapping"
        buttonIcon={<BsFolderCheck size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New mapping"
        drawerAddWidth={600}
        addFunc={addFunc}
        deploymentTable="event_mapping"
        deleteEndpoint="/event-type/mapping/"
        icon="validator"
        descriptionFunc={descFunc}
    />
}

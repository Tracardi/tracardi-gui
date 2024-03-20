import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import EventReshapingDetails from "../elements/details/EventReshapingDetails";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventReshapingForm from "../elements/forms/EventReshapingForm";

export default function EventReshaping() {

    const urlFunc = useCallback((query) => ('/event-reshape-schema' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventReshapingForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventReshapingDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Event reshaping"
        description="Event reshaping allows the change of event payload before it reaches the database and workflow.
        Event reshaping is available in commercial version of Tracardi."
        urlFunc={urlFunc}
        buttonLabel="New reshape"
        buttonIcon={<FlowNodeIcons icon="map-properties"/>}
        drawerDetailsWidth={850}
        detailsFunc={detailsFunc}
        drawerAddTitle="New reshape"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="event_reshaping"
        deleteEndpoint='/event-reshape-schema/'
        icon ="map-properties"
    />

}

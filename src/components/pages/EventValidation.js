import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventValidationDetails from "../elements/details/EventValidationDetails";
import EventValidationForm from "../elements/forms/EventValidationForm";

export default function EventValidation() {

    const urlFunc = useCallback((query) => ('/event-validator/list' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventValidationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventValidationDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Event validation"
        description="Event validation allows the check of event payload before it reaches the database and workflow.
        Event validation is available in commercial version of Tracardi."
        urlFunc={urlFunc}
        buttonLabel="New validation"
        buttonIcon={<FlowNodeIcons icon="validator"/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New validation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        icon="validator"
        deploymentTable="event_validation"
        deleteEndpoint='/event-validator/'
    />

}

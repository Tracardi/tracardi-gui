import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscCopy} from "react-icons/vsc";
import EventToProfileForm from "../elements/forms/EventToProfileForm";
import EventToProfileDetails from "../elements/details/EventToProfileDetails";

export default function EventToProfile() {

    const urlFunc = useCallback((query) => ('/events-to-profiles/by_tag' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventToProfileForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EventToProfileDetails id={id} onDeleteComplete={close}
                                                                         onEditComplete={close}/>, [])

    return <CardBrowser
        label="Map event properties to profile"
        description="List of schemas that define how you transfer information from events to your profile."
        urlFunc={urlFunc}
        buttonLabel="New mapping"
        buttonIcon={<VscCopy size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New mapping"
        drawerAddWidth={1000}
        addFunc={addFunc}
        deploymentTable="event_to_profile_mapping"
        deleteEndpoint='/event-to-profile/'
        icon="copy"
    />
}

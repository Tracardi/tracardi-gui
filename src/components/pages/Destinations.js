import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsBoxArrowRight} from "react-icons/bs";
import DestinationForm from "../elements/forms/DestinationForm";
import DestinationDetails from "../elements/details/DestinationDetails";

export default function Destinations() {

    const urlFunc = useCallback((query) => ('/destinations/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <DestinationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <DestinationDetails id={id} onDelete={close} onEdit={close}/>, []);

    return <CardBrowser
        defaultLayout="row"
        label="Profile Destinations"
        urlFunc={urlFunc}
        buttonLabel="New destination"
        buttonIcon={<BsBoxArrowRight size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New Destination"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="destination"
        deleteEndpoint='/destination/'
        icon="destination"
    />

}

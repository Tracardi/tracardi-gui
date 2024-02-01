import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import LiveSegmentDetails from "../elements/details/LiveSegmentDetails";
import SegmentationJobForm from "../elements/forms/SegmentationJobForm";

export default function Segmentation() {

    const urlFunc = useCallback((query) => ('/segments/live' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <SegmentationJobForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <LiveSegmentDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Segmentation"
        description="Segmentation is a scheduled task that updates the profile regularly by following defined segmentation rules.
        To make this happen, a separate worker process for segmentation needs to run in the background."
        urlFunc={urlFunc}
        buttonLabel="New segmentation"
        buttonIcon={<VscOrganization size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New segmentation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="workflow_segment"
        deleteEndpoint='/segment/live/'
        icon="segment"
    />

}

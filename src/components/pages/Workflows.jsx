import React, {useCallback} from "react";
import {BsGear} from "react-icons/bs";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";

export default function Workflows({defaultLayout="rows", type="collection", label}) {

    const urlFunc = useCallback((query) => (`/flows/by_tag?type=${type}` + ((query) ? "&query=" + query : "")), [type]);
    const addFunc = useCallback((close) => <FlowForm type={type} tags={[]} onFlowSaveComplete={close} />, [type])
    const detailsFunc = useCallback((id, close) => <FlowDetails id={id} onDeleteComplete={close}/>, [])

    return <CardBrowser
        label={label}
        defaultLayout={defaultLayout}
        description="List of defined workflows. You may filter this list by workflow name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New workflow"
        buttonIcon={<BsGear size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New workflow"
        drawerAddWidth={600}
        addFunc={addFunc}
        deploymentTable="workflow"
        icon={type==='collection' ? "flow" : "segment"}
        deleteEndpoint='/flow/'
    />
}

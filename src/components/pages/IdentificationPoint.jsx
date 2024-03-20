import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import IdentificationPointForm from "../elements/forms/IdentifiactionPointForm";
import IdentificationPointDetails from "../elements/details/IdentificationPointDetails";

export default function IdentificationPoint() {

    const urlFunc = useCallback((query) => ('/identification/points' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <IdentificationPointForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <IdentificationPointDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Identification point"
        description="Identification point is an event in the customer journey that allows you to identify customer. "
        urlFunc={urlFunc}
        buttonLabel="New identification"
        buttonIcon={<FlowNodeIcons icon="identity"/>}
        drawerDetailsWidth={850}
        detailsFunc={detailsFunc}
        drawerAddTitle="New identification"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="identification_point"
        deleteEndpoint='/identification/point/'
        icon="identity"
    />

}

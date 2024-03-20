import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {FaUncharted} from "react-icons/fa";
import RuleForm from "../elements/forms/RuleForm";
import RuleDetails from "../elements/details/RuleDetails";


export default function TriggerRules() {

    const urlFunc = useCallback((query) => ('/rules/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <RuleForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDeleteComplete={close}
                                                                onEditComplete={close}/>, []);

    return <CardBrowser
        label="Trigger Rules"
        description="Triggers prompt workflows when special things happen, deciding which one to run based on
        conditions like specific events or added segments. Each trigger has two parts: one decides when to start,
        and the other specifies the workflow. If the starting condition is met, the workflow begins."
        urlFunc={urlFunc}
        buttonLabel="New trigger"
        buttonIcon={<FaUncharted size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New trigger"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="trigger"
        deleteEndpoint='/rule/'
        icon="trigger"
    />

}

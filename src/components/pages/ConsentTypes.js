import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscLaw} from "react-icons/vsc";
import ConsentDetails from "../elements/details/ConsentDetails";
import ConsentForm from "../elements/forms/ConsentForm";


export default function  ConsentTypes() {

    const urlFunc= useCallback((query) => ('/consents/types' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <ConsentForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <ConsentDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    return <CardBrowser
        defaultLayout="row"
        label="Consent types"
        description="User consent refers to the process of obtaining permission from an individual to collect, use, or
        share their personal data. This is the list of defined consent types that you may require from your customers.
        You may filter this list by consent name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New consent type"
        buttonIcon={<VscLaw size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New consent type"
        drawerAddWidth={600}
        addFunc={addFunc}
        deploymentTable="consent_type"
        deleteEndpoint='/consent/type/'
        icon="consent"
    />
}

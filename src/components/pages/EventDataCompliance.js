import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscLaw} from "react-icons/vsc";
import DataComplianceForm from "../elements/forms/DataComplianceForm";
import DataComplianceDetails from "../elements/details/DataComplianceDetails";


export default function  ConsentsDataCompliance() {

    const urlFunc= useCallback((query) => ('/consent/compliance/fields' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <DataComplianceForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <DataComplianceDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    return <CardBrowser
        defaultLayout="row"
        label="Data compliance with customer consents"
        description="Data compliance refers to the practice of adhering to laws, regulations, and guidelines related
        to the handling, processing, and storing of data. This is the list of defined field level data compliances
        with customer consents."
        urlFunc={urlFunc}
        buttonLabel="New compliance"
        buttonIcon={<VscLaw size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New compliance"
        drawerAddWidth={1200}
        addFunc={addFunc}
        deploymentTable="data_compliance"
        deleteEndpoint='/consent/compliance/field/'
        icon="consent"
    />
}

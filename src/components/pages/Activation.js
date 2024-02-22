import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {MdOutlineSendTimeExtension} from "react-icons/md";
import ActivationFormById from "../elements/forms/ActivationForm";


export default function Activation() {

    const urlFunc = useCallback((query) => ('/activation' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ActivationFormById onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ActivationFormById activationId={id} onSubmit={close}/>, [])

    return <CardBrowser
        label="Audience Activations"
        description="List of Audience Activations. You may filter this list by activation name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New activation"
        buttonIcon={<MdOutlineSendTimeExtension size={20}/>}
        drawerDetailsWidth={1100}
        detailsFunc={detailsFunc}
        drawerAddTitle="New activation"
        drawerAddWidth={1100}
        addFunc={addFunc}
        deploymentTable="activation"
        deleteEndpoint="/activation/"
        icon="activate"
    />
}

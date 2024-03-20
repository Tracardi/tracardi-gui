import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsPersonLinesFill} from "react-icons/bs";
import SubscriptionForm from "../elements/forms/SubscriptionForm";


export default function Subscription() {

    const urlFunc = useCallback((query) => ('/subscription' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <SubscriptionForm subscriptionId={null} onComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <SubscriptionForm subscriptionId={id} onComplete={close}/>, [])

    return <CardBrowser
        label="Subscriptions"
        description="List of defined subscription topics. You may filter this list by topic name in the upper search box."
        urlFunc={urlFunc}
        buttonLabel="New subscription"
        buttonIcon={<BsPersonLinesFill size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New subscription"
        drawerAddWidth={600}
        addFunc={addFunc}
        deploymentTable="subscription"
        deleteEndpoint="/subscription/"
        icon="subscription"
    />
}

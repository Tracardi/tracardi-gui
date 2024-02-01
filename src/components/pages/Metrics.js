import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscDashboard} from "react-icons/vsc";
import MetricForm from "../elements/forms/MetricsForm";
import {MetricDetailsById} from "../elements/details/MetricDetails";

export default function Metrics() {

    const urlFunc = useCallback((query) => ('/settings/metric' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <MetricForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <MetricDetailsById id={id} onDeleteComplete={close} onEditComplete={close}/>, []);

    return <CardBrowser
        label="Profile Metrics Computations"
        description="Profile metrics are calculated from event data whenever new events are added or changes are made to the profile, or on a regular basis."
        urlFunc={urlFunc}
        buttonLabel="New metric"
        buttonIcon={<VscDashboard size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New metric"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        deploymentTable="metrics"
        deleteEndpoint='/setting/metric/'
        icon="metric"
    />

}

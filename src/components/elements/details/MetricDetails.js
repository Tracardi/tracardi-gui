import {useFetch} from "../../../remote_api/remoteState";
import {getMetricById} from "../../../remote_api/endpoints/metrics";
import NoData from "../misc/NoData";
import FetchError from "../../errors/FetchError";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import React from "react";
import Properties from "./DetailProperties";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";

export function MetricDetails({data, onDeleteComplete, onEditComplete}) {
    return <TuiForm style={{margin:20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Metric settings"/>
            <TuiFormGroupContent>
                <Properties properties={data}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export function MetricDetailsById({id, onDeleteComplete, onEditComplete}) {

    const query = useFetch(
        ["getMetric", [id]],
        getMetricById(id),
        data => {
            return data
        })

    if (query.isError) {
        if (query.error.status === 404)
            return <NoData header="Could not find metric.">
                This can happen if the metric was deleted.
            </NoData>
        return <FetchError error={query.error}/>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <MetricDetails data={query.data}/>}
    </>
}
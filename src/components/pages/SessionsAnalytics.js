import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";

export default function SessionsAnalytics() {

    const onLoadDataRequest = (query) => {
        return {
            url: '/session/select/range',
            method: "post",
            data: query
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/session/select/histogram',
            method: "post",
            data: query
        }
    }

    return <DataAnalytics
        label="List of sessions"
        enableFiltering={true}
        type="session"
        timeFieldLabel = "timestamp"
        filterFields={['metadata.time', 'context.storage', 'context.screen']}
        timeField={(row) => [row.metadata.time.insert]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
    />

}
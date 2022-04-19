import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";

export default function LogsAnalytics({displayChart=true}) {

    const onLoadDataRequest = (query) => {
        return {
            url: '/log/select/range',
            method: "post",
            data: query
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/log/select/histogram',
            method: "post",
            data: query
        }
    }

    return <DataAnalytics
        label="List of logs"
        enableFiltering={true}
        type="log"
        timeFieldLabel = "date"
        filterFields={['date']}
        timeField={(row) => [row.date]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        displayChart={displayChart}
    />

}
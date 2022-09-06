import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import { makeUtcStringTzAware } from "../../misc/converters";

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
            url: '/log/select/histogram?group_by=level',
            method: "post",
            data: query
        }
    }

    return <DataAnalytics
        label="List of logs"
        enableFiltering={true}
        type="log"
        timeFieldLabel = "date"
        filterFields={['date', 'id', 'line']}
        timeField={(row) => [makeUtcStringTzAware(row.date)]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        displayChart={displayChart}
        barChartColors={{error: "#d81b60", warning: "#ef6c00"}}
    />

}
import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import { makeUtcStringTzAware } from "../../misc/converters";

export default function EntityAnalytics({displayChart=true}) {

    const onLoadDataRequest = (query) => {
        return {
            url: '/entity/select/range',
            method: "post",
            data: query,
            limit: 30
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/entity/select/histogram',
            method: "post",
            data: query,
            limit: 30
        }
    }

    return <DataAnalytics
        type="entity"
        label="List of Entities"
        enableFiltering={true}
        timeFieldLabel = "last update"
        timeField={(row) => [makeUtcStringTzAware(row.metadata.time.insert)]}
        filterFields={['metadata.time.insert']}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        detailsDrawerWidth={1250}
        displayChart={displayChart}
    />

}
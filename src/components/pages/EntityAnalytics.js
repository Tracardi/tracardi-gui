import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";

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

    // const onLoadDetails = (id) => {
    //     return {
    //         url: "/entity/" + id, method: "get"
    //     }
    // }

    // const displayDetails = (data) => <ProfileDetails profile={data}/>

    return <DataAnalytics
        type="entity"
        label="List of Entities"
        enableFiltering={true}
        timeFieldLabel = "last update"
        timeField={(row) => [row.timestamp]}
        filterFields={['timestamp']}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        // onLoadDetails={onLoadDetails}
        // displayDetails={displayDetails}
        detailsDrawerWidth={1250}
        displayChart={displayChart}
    />

}
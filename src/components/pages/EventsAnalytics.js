import React from "react";
import "./DataAnalytics.css";
import EventDetails from "../elements/details/EventDetails";
import DataAnalytics from "./DataAnalytics";

export default function EventsAnalytics() {


    const onLoadDataRequest = (query) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: query
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/event/select/histogram',
            method: "post",
            data: query
        }
    }

    const onLoadDetails = (id) => {
        return {
            url: "/event/" + id, method: "get"
        }
    }

    const displayDetails = (data) => <EventDetails data={data}/>

    return <DataAnalytics
        type="event"
        enableFiltering={true}
        detailsLabel="Event details"
        timeFieldLabel = "timestamp"
        filterFields={[
            'context.page.path',
            'context.page.history.length',
            'context.page.hash',
            'context.page.search',
            'context.page.referer',
            'context.screen',
            'metadata.time'
        ]}
        timeField={(row) => [row.metadata.time.insert, row.type]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        detailsDrawerWidth={1000}
        displayDetails={displayDetails}
    />

}
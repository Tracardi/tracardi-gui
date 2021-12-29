import React from "react";
import "./DataAnalytics.css";
import EventDetails from "../elements/details/EventDetails";
import DataAnalytics from "./DataAnalytics";
import EventStatusTag from "../elements/misc/EventStatusTag";

export default function EventsAnalytics() {

    const onLoadDataRequest = (query) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: query,
            limit: 30
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/event/select/histogram',
            method: "post",
            data: query,
            limit: 30
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
        label="List of events"
        enableFiltering={true}
        timeFieldLabel = "timestamp"
        filterFields={[
            'session.profile',
            'session.context',
            'session.operation',
            'context.config',
            'profile.operation',
            'metadata.time'
        ]}
        timeField={(row) => [row.metadata.time.insert, row.type, <EventStatusTag label={row.metadata.status}/>]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        detailsDrawerWidth={1000}
        displayDetails={displayDetails}
        displayChart={true}
    />

}
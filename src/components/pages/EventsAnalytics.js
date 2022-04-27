import React from "react";
import "./DataAnalytics.css";
import EventDetails from "../elements/details/EventDetails";
import DataAnalytics from "./DataAnalytics";
import EventStatusTag from "../elements/misc/EventStatusTag";
import EventTypeTag from "../elements/misc/EventTypeTag";

export default function EventsAnalytics({displayChart=true}) {

    const onLoadDataRequest = (query) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: query,
            limit: 30,
            page: 0
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/event/select/histogram?group_by=metadata.status',
            method: "post",
            data: query,
            limit: 30,
            page: 0
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
        timeField={(row) => [row.metadata.time.insert, <EventTypeTag eventType={row.type} profile={row?.profile?.id}/>, <EventStatusTag label={row.metadata.status}/>]}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        detailsDrawerWidth={1050}
        displayDetails={displayDetails}
        displayChart={displayChart}
        barChartColors={{processed: "#00C49F", error: "#d81b60", collected: '#0088FE'}}
    />
}
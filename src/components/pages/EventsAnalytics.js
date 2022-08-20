import React from "react";
import "./DataAnalytics.css";
import EventDetails from "../elements/details/EventDetails";
import DataAnalytics from "./DataAnalytics";
import EventStatusTag from "../elements/misc/EventStatusTag";
import EventTypeTag from "../elements/misc/EventTypeTag";
import { makeUtcStringTzAware } from "../../misc/converters";

export default function EventsAnalytics({displayChart=true}) {

    const handleLoadDataRequest = (query) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: query,
            limit: 30,
            page: 0
        }
    }

    const handleLoadHistogramRequest = (query) => {
        return {
            url: '/event/select/histogram?group_by=metadata.status',
            method: "post",
            data: query,
            limit: 30,
            page: 0
        }
    }

    const handleLoadDetails = (id) => {
        return {
            url: "/event/" + id, method: "get"
        }
    }

    const displayDetails = (data) => <EventDetails event={data?.event} metadata={data?._metadata}/>

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
            'profile.metadata',
            'profile.pii',
            'profile.stats',
            'profile.traits',
            'profile.segments',
            'metadata',
            'context'
        ]}
        timeField={(row) => [makeUtcStringTzAware(row.metadata.time.insert), <EventTypeTag eventType={row.type} profile={row?.profile?.id}/>, <EventStatusTag label={row.metadata.status}/>]}

        onLoadHistogramRequest={handleLoadHistogramRequest}
        onLoadDataRequest={handleLoadDataRequest}
        onLoadDetails={handleLoadDetails}
        detailsDrawerWidth={1050}

        displayDetails={displayDetails}
        displayChart={displayChart}
        barChartColors={{processed: "#00C49F", error: "#d81b60", collected: '#0088FE'}}
    />
}
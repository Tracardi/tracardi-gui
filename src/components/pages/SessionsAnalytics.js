import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import { makeUtcStringTzAware } from "../../misc/converters";
import SessionRow from "../elements/lists/rows/SessionRow";

export default function SessionsAnalytics({displayChart=true}) {

    const handleLoadDataRequest = (query) => {
        return {
            url: '/session/select/range',
            method: "post",
            data: query
        }
    }

    const handleLoadDetails = (id) => {
        return {
            url: "/session/" + id, method: "get"
        }
    }

    const handleLoadHistogramRequest = (query) => {
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
        filterFields={['metadata.time', 'time.tz', 'time.local']}
        timeField={(row) => [makeUtcStringTzAware(row.metadata.time.insert)]}
        onLoadHistogramRequest={handleLoadHistogramRequest}
        onLoadDataRequest={handleLoadDataRequest}
        onLoadDetails={handleLoadDetails}
        displayChart={displayChart}
        detailsDrawerWidth={1200}
        rowDetails={(session, filterFields) => <SessionRow session={session} filterFields={filterFields}/>}
    />

}
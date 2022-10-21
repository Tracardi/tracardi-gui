import React from "react";
import "./DataAnalytics.css";
import EventDetails from "../elements/details/EventDetails";
import DataAnalytics from "./DataAnalytics";
import EventStatusTag from "../elements/misc/EventStatusTag";
import EventTypeTag from "../elements/misc/EventTypeTag";
import {makeUtcStringTzAware} from "../../misc/converters";
import EventValidation from "../elements/misc/EventValidation";
import EventErrors from "../elements/misc/EventErrors";
import EventWarnings from "../elements/misc/EventWarnings";
import PropertyField from "../elements/details/PropertyField";
import ProfileDetails from "../elements/details/ProfileDetails";
import JsonStringify from "../elements/misc/JsonStingify";
import {isEmptyObject} from "../../misc/typeChecking";
import {profileName} from "../../misc/formaters";

export default function EventsAnalytics({displayChart = true}) {

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
        timeFieldLabel="timestamp"
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
        timeField={(row) => [
            makeUtcStringTzAware(row.metadata.time.insert),
            <EventTypeTag eventType={row.type} profile={row?.profile?.id}/>,
            <EventStatusTag label={row.metadata.status}/>,
            <EventValidation eventMetaData={row.metadata}/>,
            <EventWarnings eventMetaData={row.metadata}/>,
            <EventErrors eventMetaData={row.metadata}/>,
        ]}
        rowDetails={(row, filterFields) => {
            return <div style={{display: "flex"}}>
                <div style={{flex: "1 1 0", minWidth: 500, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                    <PropertyField name="id" content={row.id} drawerSize={1000}>
                        <EventDetails event={row} />
                    </PropertyField>
                    <PropertyField name="Profile" content={profileName(row.profile)} drawerSize={1200}>
                        <ProfileDetails profile={row.profile}/>
                    </PropertyField>
                    <PropertyField name="Profile visits" content={row.profile?.metadata?.time?.visit?.count}/>
                    <PropertyField name="Session id" content={row.source?.id}/>
                    <PropertyField name="Process time" content={row.metadata?.time?.process_time}/>
                </div>
                <div style={{flex: "2 1 0", paddingLeft: 15}}>
                    {!isEmptyObject(row.properties) ? <JsonStringify data={row.properties} filterFields={filterFields}/> : "No properties"}
                </div>
            </div>
        }}
        onLoadHistogramRequest={handleLoadHistogramRequest}
        onLoadDataRequest={handleLoadDataRequest}
        onLoadDetails={handleLoadDetails}
        detailsDrawerWidth={1050}
        displayDetails={displayDetails}
        displayChart={displayChart}
        barChartColors={{processed: "#00C49F", error: "#d81b60", collected: '#0088FE'}}
    />
}
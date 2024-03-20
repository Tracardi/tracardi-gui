import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import { makeUtcStringTzAware } from "../../misc/converters";
import ProfileRow from "../elements/lists/rows/ProfileRow";

export default function ProfilesAnalytics({displayChart=true}) {

    const onLoadDataRequest = (query) => {
        return {
            url: '/profile/select/range',
            method: "post",
            data: query,
            limit: 30
        }
    }

    const onLoadHistogramRequest = (query) => {
        return {
            url: '/profile/select/histogram',
            method: "post",
            data: query,
            limit: 30
        }
    }

    const onLoadDetails = (id) => {
        return {
            url: "/profile/" + id, method: "get"
        }
    }

    const label = `List of ${window?.CONFIG?.profile?.plural || 'profiles'}`

    return <DataAnalytics
        type="profile"
        label={label}
        enableFiltering={true}
        timeFieldLabel = "last visit"
        timeField={(row) => [makeUtcStringTzAware(row.metadata.time.insert)]}
        filterFields={['metadata.time.insert','metadata.time.update']}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        detailsDrawerWidth={1200}
        displayChart={displayChart}
        rowDetails={(profile, filterFields) => {
            return <ProfileRow profile={profile} filterFields={filterFields} displayDetails={true}/>
        }}
    />

}
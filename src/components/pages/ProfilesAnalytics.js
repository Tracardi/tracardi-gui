import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import ProfileDetails from "../elements/details/ProfileDetails";

export default function ProfilesAnalytics() {


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

    const displayDetails = (data) => <ProfileDetails data={data}/>

    return <DataAnalytics
        type="profile"
        label="List of profiles"
        enableFiltering={true}
        timeFieldLabel = "last visit"
        timeField={(row) => [row.metadata.time.insert]}
        filterFields={['metadata.time.insert','metadata.time.update']}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        displayDetails={displayDetails}
        detailsDrawerWidth={1200}
    />

}
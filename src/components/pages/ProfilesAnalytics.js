import React from "react";
import "./DataAnalytics.css";
import DataAnalytics from "./DataAnalytics";
import ProfileDetails from "../elements/details/ProfileDetails";
import { makeUtcStringTzAware } from "../../misc/converters";
import PropertyField from "../elements/details/PropertyField";
import {isEmptyObject} from "../../misc/typeChecking";
import JsonStringify from "../elements/misc/JsonStingify";
import {profileName} from "../../misc/formaters";
import ActiveTag from "../elements/misc/ActiveTag";

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

    const displayDetails = (data) => <ProfileDetails profile={data}/>

    return <DataAnalytics
        type="profile"
        label="List of profiles"
        enableFiltering={true}
        timeFieldLabel = "last visit"
        timeField={(row) => [makeUtcStringTzAware(row.metadata.time.insert)]}
        filterFields={['metadata.time.insert','metadata.time.update']}
        onLoadHistogramRequest={onLoadHistogramRequest}
        onLoadDataRequest={onLoadDataRequest}
        onLoadDetails={onLoadDetails}
        displayDetails={displayDetails}
        detailsDrawerWidth={1250}
        displayChart={displayChart}
        rowDetails={(profile, filterFields) => {
            return <div style={{display: "flex"}}>
                <div style={{flex: "1 1 0", minWidth: 400, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                    <PropertyField name="Profile" content={profileName(profile)}/>
                    <PropertyField name="Previous visit" content={profile?.metadata?.time?.visit.last}/>
                    <PropertyField name="Visits" content={profile?.metadata?.time?.visit.count}/>
                    <PropertyField name="Email" content={profile?.pii?.email}/>
                    <PropertyField name="Telephone" content={profile?.pii?.telephone}/>
                    <PropertyField name="Active" content={<ActiveTag active={profile?.active}/>}/>
                </div>
                <div style={{flex: "3 1 0", width: "100%", paddingLeft: 15}}>
                    {!isEmptyObject(profile.traits) ? <JsonStringify data={profile.traits} filterFields={filterFields}/> : "No traits"}
                </div>
            </div>
        }}
    />

}
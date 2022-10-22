import PropertyField from "../../details/PropertyField";
import EventDetails from "../../details/EventDetails";
import {profileName} from "../../../../misc/formaters";
import ProfileDetails from "../../details/ProfileDetails";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React from "react";
import DateValue from "../../misc/DateValue";
import EventTypeTag from "../../misc/EventTypeTag";
import EventStatusTag from "../../misc/EventStatusTag";
import EventValidation from "../../misc/EventValidation";
import EventWarnings from "../../misc/EventWarnings";
import EventErrorTag from "../../misc/EventErrorTag";
import TuiTags from "../../tui/TuiTags";

export function EventRow({row, filterFields}) {

    return <div style={{display: "flex"}}>
        <div style={{flex: "1 1 0", minWidth: 500, borderRight: "solid 1px #ccc", paddingRight: 17}}>
            <PropertyField name="id" content={row.id}/>
            <PropertyField name="Created" content={<DateValue date={row.metadata?.time?.insert}/>}/>
            <PropertyField name="Profile" content={profileName(row.profile)} drawerSize={1200}>
                <ProfileDetails profile={row.profile}/>
            </PropertyField>
            <PropertyField name="Profile visits" content={row.profile?.metadata?.time?.visit?.count}/>
            <PropertyField name="Session id" content={row.source?.id}/>
            <PropertyField name="Routed by" content={<TuiTags tags={row.metadata?.processed_by?.rules} size="small"/>}/>
            <PropertyField name="Process time" content={row.metadata?.time?.process_time} underline={false}/>
        </div>
        <div style={{flex: "2 1 0", paddingLeft: 15}}>
            <div style={{paddingRight: 15}}>
                <PropertyField underline={false}
                               drawerSize={1000}
                               content={<div style={{display: "flex", gap: 5, alignItems: "center"}}>
                                   <EventTypeTag eventType={row.type} profile={row?.profile?.id}/>
                                   <EventStatusTag label={row.metadata.status}/>
                                   <EventValidation eventMetaData={row.metadata}/>
                                   <EventWarnings eventMetaData={row.metadata}/>
                                   <EventErrorTag eventMetaData={row.metadata}/>
                               </div>}>
                    <EventDetails event={row}/>
                </PropertyField>
            </div>

            <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                <legend>Properties</legend>
                {!isEmptyObject(row.properties) ?
                    <JsonStringify data={row.properties} filterFields={filterFields}/> : "No properties"}
            </fieldset>
        </div>
    </div>
}
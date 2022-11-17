import {object2dot} from "../../../misc/dottedObject";
import PropertyField from "./PropertyField";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import ProfileDetails from "./ProfileDetails";
import EventSourceDetails from "./EventSourceDetails";
import EventStatusTag from "../misc/EventStatusTag";
import EventValidation from "../misc/EventValidation";
import {BsCheckCircle, BsXSquare} from "react-icons/bs";
import React from "react";
import SessionContextInfo from "./SessionContextInfo";
import TuiTags from "../tui/TuiTags";
import DateValue from "../misc/DateValue";
import EventWarnings from "../misc/EventWarnings";
import EventErrorTag from "../misc/EventErrorTag";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import NoData from "../misc/NoData";


const EventData = ({event, allowedDetails=[]}) => {

    const ContextInfo = () => {
        const context = object2dot(event?.context);
        return <>{Object.keys(context).map(key => <PropertyField key={key} name={key} content={context[key]}/>)}</>
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event?.properties);
        return <>{Object.keys(eventProperties).map(key => <PropertyField key={key} name={key}
                                                                         content={eventProperties[key]}/>)}</>
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Type" content={<IconLabel icon={<FlowNodeIcons icon="event" />} value={event?.type}/>}/>
                <PropertyField name="Insert time"
                               content={<DateValue date={event?.metadata?.time?.insert}/>}
                />
                <PropertyField name="Status"
                               content={<><EventStatusTag label={event?.metadata?.status}/>
                                   <EventValidation eventMetaData={event?.metadata}/>
                                   <EventWarnings eventMetaData={event?.metadata}/>
                                   <EventErrorTag eventMetaData={event?.metadata}/>
                                   </>}/>

                {event?.session && <PropertyField name="Session duration" content={Math.floor(event.session.duration / 60).toString() + "m"}>

                </PropertyField>}
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}

                {event?.profile && <PropertyField name="Profile id" content={event.profile.id} drawerSize={1320}>
                    {allowedDetails.includes("profile") && event.profile && <ProfileDetails profile={event.profile}/>}
                </PropertyField>}
                {event?.source && <PropertyField name="Event source" content={event.source.id} drawerSize={820}>
                    {allowedDetails.includes("source") && <EventSourceDetails id={event.source.id}/>}
                </PropertyField>}

                <PropertyField name="Debug" content={event?.metadata?.debug ?
                    <BsCheckCircle size={18} color="#00c853"/> : <BsXSquare size={18} color="#d81b60"/>}/>
                <PropertyField name="Profile less" content={event?.metadata?.profile_less ?
                    <BsCheckCircle size={18} color="#00c853"/> : <BsXSquare size={18} color="#d81b60"/>}/>
                <PropertyField name="Updated time"
                               content={event?.update ? <BsCheckCircle size={18} color="#00c853"/> :
                                   <BsXSquare size={18} color="#d81b60"/>}/>

                <PropertyField name="Tags"
                               content={Array.isArray(event?.tags?.values) && <TuiTags tags={event.tags.values} size="small"/>}
                />
                {Array.isArray(event?.metadata?.processed_by?.rules) && <PropertyField name="Routed by rules"
                               content={<TuiTags tags={event.metadata?.processed_by?.rules} size="small"/>}/>}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Properties"/>
                {!isEmptyObjectOrNull(event?.properties) ? <EventProperties/> : <NoData header="No properties">
                    This event does not have any properties.
                </NoData>}
        </TuiFormGroup>

        {!isEmptyObjectOrNull(event?.context) && <TuiFormGroup>
            <TuiFormGroupHeader header="Context"/>
            <TuiFormGroupContent>
                <ContextInfo/>
                <div style={{marginTop: 20}}>
                    {event?.session?.id && <SessionContextInfo sessionId={event?.session?.id}/>}
                </div>
            </TuiFormGroupContent>
        </TuiFormGroup>}
    </TuiForm>
}

export default EventData;
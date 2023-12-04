import {object2dot} from "../../../misc/dottedObject";
import PropertyField from "./PropertyField";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
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
import NoData from "../misc/NoData";
import TuiWorkflowTags from "../tui/TuiWorkflowTags";
import Tabs, {TabCase} from "../tabs/Tabs";
import useTheme from "@mui/material/styles/useTheme";
import EventTypeTag from "../misc/EventTypeTag";
import EventJourneyTag from "../misc/EventJourneyTag";
import MergingAlert from "../misc/MergingAlert";

const ContextInfo = ({event}) => {
    const context = object2dot(event?.context);
    return <>{Object.keys(context).map(key => <PropertyField labelWidth={350} key={key} name={key} content={context[key]}/>)}</>
}

const EventProperties = ({event}) => {
    const eventProperties = object2dot(event?.properties);
    return <>{Object.keys(eventProperties).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                     content={eventProperties[key]}/>)}</>
}
const EventTraits = ({event}) => {
    const eventTraits = object2dot(event?.traits);
    return <>{Object.keys(eventTraits).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                 content={eventTraits[key]}/>)}</>
}

export const EventDataTable = ({event}) => {
    const eventTraits = object2dot(event?.data);
    return <>{Object.keys(eventTraits).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                 content={eventTraits[key]}/>)}</>
}

const EventOs = ({event}) => {
    const eventOs = object2dot(event?.os);
    return <>{Object.keys(eventOs).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                             content={eventOs[key]}/>)}</>
}

const EventDevice = ({event}) => {
    const data = object2dot(event?.device);
    return <>{Object.keys(data).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                          content={data[key]}/>)}</>
}

const EventData = ({event, metadata, allowedDetails = [], routing=true}) => {

    const _theme = useTheme()

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Type"
                               content={<EventTypeTag event={event}/>}/>
                <PropertyField name="Insert time"
                               content={<DateValue date={event?.metadata?.time?.insert}/>}
                />
                <PropertyField name="Process time"
                               content={<div>Workflow: {event?.metadata?.time?.process_time}, Total: {event?.metadata?.time?.total_time}</div>}/>
                <PropertyField name="Status"
                               content={<><EventStatusTag label={event?.metadata?.status}/>
                                   <EventValidation eventMetaData={event?.metadata}/>
                                   <MergingAlert eventMetaData={event?.metadata}/>
                                   <EventWarnings eventMetaData={event?.metadata}/>
                                   <EventErrorTag eventMetaData={event?.metadata}/>
                               </>}/>
                {event.journey.state && <PropertyField name="Journey state" content={<EventJourneyTag>{event.journey.state}</EventJourneyTag>} size="small"/>}

                {event?.session && <PropertyField name="Session duration"
                                                  content={Math.floor(event.session.duration / 60).toString() + "m"}>

                </PropertyField>}
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}

                {event?.profile && <PropertyField name="Profile id" content={event.profile.id} drawerSize={1200}/>}
                {event?.source && <PropertyField name="Event source" content={event.source.id} drawerSize={820} detailsRoles={['admin', 'developer']}>
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
                               content={Array.isArray(event?.tags?.values) &&
                               <TuiTags tags={event.tags.values} size="small"/>}
                />
                {routing && Array.isArray(event?.metadata?.processed_by?.rules) && <PropertyField name="Routed by rules"
                                                                                       content={<TuiTags
                                                                                           tags={event.metadata?.processed_by?.rules}
                                                                                           size="small"/>}/>}
                {Array.isArray(event?.metadata?.processed_by?.flows) && <PropertyField
                    name="Processed by flow"
                    content={<TuiWorkflowTags tags={event.metadata?.processed_by?.flows} size="small" />}/>}
                {metadata?.index && <PropertyField name="Index" content={metadata.index}/>}

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <Tabs tabs={["Data", "Traits", "Properties", "OS", "Device", "Context"]} tabsStyle={{backgroundColor: _theme.palette.background.paper}}>
                <TabCase id={0}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.data) ? <EventDataTable event={event}/> :
                            <NoData header="No indexed data">
                                This event does not have any indexed data.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={1}>
                    <section style={{margin: 20}}>
                    {!isEmptyObjectOrNull(event?.traits) ? <EventTraits event={event}/> :
                        <NoData header="No traits">
                            This event does not have any traits.
                        </NoData>}
                    </section>
                </TabCase>
                <TabCase id={2}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.properties) ? <EventProperties event={event}/>:
                            <NoData header="No properties">
                                This event does not have any properties.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={3}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.os) && event?.os?.name ? <EventOs event={event}/> :
                            <NoData header="No operating system data">
                                This event does not have any information on OS.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={4}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.device) && event?.device?.name ? <EventDevice event={event}/> :
                            <NoData header="No device data">
                                This event does not have any information on used device.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={5}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.context) ?<><ContextInfo event={event}/>
                                <div style={{marginTop: 20}}>
                                    {event?.session?.id && <SessionContextInfo sessionId={event?.session?.id}/>}
                                </div></>
                        : <NoData header="No context data">
                                This event does not have any context data.
                            </NoData>}
                    </section>
                </TabCase>
            </Tabs>
        </TuiFormGroup>


    </TuiForm>
}

export default EventData;

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
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import NoData from "../misc/NoData";
import TuiWorkflowTags from "../tui/TuiWorkflowTags";
import Tabs, {TabCase} from "../tabs/Tabs";
import useTheme from "@mui/material/styles/useTheme";


const EventData = ({event, metadata, allowedDetails = [], routing=true}) => {

    const _theme = useTheme()

    const ContextInfo = () => {
        const context = object2dot(event?.context);
        return <>{Object.keys(context).map(key => <PropertyField labelWidth={350} key={key} name={key} content={context[key]}/>)}</>
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event?.properties);
        return <>{Object.keys(eventProperties).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                         content={eventProperties[key]}/>)}</>
    }
    const EventTraits = () => {
        const eventTraits = object2dot(event?.traits);
        return <>{Object.keys(eventTraits).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                         content={eventTraits[key]}/>)}</>
    }

    const EventOs = () => {
        const eventOs = object2dot(event?.os);
        return <>{Object.keys(eventOs).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                     content={eventOs[key]}/>)}</>
    }

    const EventDevice = () => {
        const data = object2dot(event?.device);
        return <>{Object.keys(data).map(key => <PropertyField labelWidth={350} key={key} name={key}
                                                                 content={data[key]}/>)}</>
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Type"
                               content={<IconLabel icon={<FlowNodeIcons icon="event"/>} value={event?.type}/>}/>
                <PropertyField name="Insert time"
                               content={<DateValue date={event?.metadata?.time?.insert}/>}
                />
                <PropertyField name="Process time"
                               content={event?.metadata?.time?.process_time} underline={false}/>
                <PropertyField name="Status"
                               content={<><EventStatusTag label={event?.metadata?.status}/>
                                   <EventValidation eventMetaData={event?.metadata}/>
                                   <EventWarnings eventMetaData={event?.metadata}/>
                                   <EventErrorTag eventMetaData={event?.metadata}/>
                               </>}/>

                {event?.session && <PropertyField name="Session duration"
                                                  content={Math.floor(event.session.duration / 60).toString() + "m"}>

                </PropertyField>}
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}

                {event?.profile && <PropertyField name="Profile id" content={event.profile.id} drawerSize={1320}/>}
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
                               content={Array.isArray(event?.tags?.values) &&
                               <TuiTags tags={event.tags.values} size="small"/>}
                />
                {routing && Array.isArray(event?.metadata?.processed_by?.rules) && <PropertyField name="Routed by rules"
                                                                                       content={<TuiTags
                                                                                           tags={event.metadata?.processed_by?.rules}
                                                                                           size="small"/>}/>}
                {routing && Array.isArray(event?.metadata?.processed_by?.flows) && <PropertyField
                    name="Processed by flow"
                    content={<TuiWorkflowTags tags={event.metadata?.processed_by?.flows} size="small" />}/>}
                {metadata?.index && <PropertyField name="Index" content={metadata.index}/>}

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <Tabs tabs={["Traits", "Properties", "Operating System", "Device", "Context"]} tabsStyle={{backgroundColor: _theme.palette.primary.light}}>
                <TabCase id={0}>
                    <section style={{margin: 20}}>
                    {!isEmptyObjectOrNull(event?.traits) ? <EventTraits/> :
                        <NoData header="No traits">
                            This event does not have any traits.
                        </NoData>}
                    </section>
                </TabCase>
                <TabCase id={1}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.properties) ? <EventProperties/>:
                            <NoData header="No properties">
                                This event does not have any properties.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={2}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.os) && event?.os?.name ? <EventOs/> :
                            <NoData header="No operating system data">
                                This event does not have any information on OS.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={3}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.device) && event?.device?.name ? <EventDevice/> :
                            <NoData header="No device data">
                                This event does not have any information on used device.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={4}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.context) ?<><ContextInfo/>
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
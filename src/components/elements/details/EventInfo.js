import React from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {object2dot} from "../../../misc/dottedObject";
import PropertyField from "./PropertyField";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import EventSourceDetails from "./EventSourceDetails";
import EventStatusTag from "../misc/EventStatusTag";
import EventValidation from "../misc/EventValidation";
import TuiTags from "../tui/TuiTags";
import DateValue from "../misc/DateValue";
import IdLabel from "../misc/IconLabels/IdLabel";
import EventDetails from "./EventDetails";
import EventWarnings from "../misc/EventWarnings";
import EventErrorTag from "../misc/EventErrorTag";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getEventById} from "../../../remote_api/endpoints/event";
import FetchError from "../../errors/FetchError";
import Tabs, {TabCase} from "../tabs/Tabs";
import {EventDataTable} from "./EventData";
import EventTypeTag from "../misc/EventTypeTag";
import EventJourneyTag from "../misc/EventJourneyTag";


const EventDataDetails = ({event, metadata, allowedDetails = []}) => {

    const ContextInfo = () => {
        const context = object2dot(event?.context);
        return <div style={{margin: 20}}>{Object.keys(context).map(key => <PropertyField key={key} name={key} content={context[key]}/>)}</div>
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event?.properties);
        return <div style={{margin: 20}}>{Object.keys(eventProperties).map(key => <PropertyField key={key} name={key}
                                                                         content={eventProperties[key]}/>)}</div>
    }
    const EventTraits = () => {
        const traits = object2dot(event?.traits);
        return <div style={{margin: 20}}>{Object.keys(traits).map(key => <PropertyField key={key} name={key}
                                                                content={traits[key]}/>)}</div>
    }

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Id" content={<IdLabel label={event?.id}/>}>
                    <EventDetails event={event}/>
                </PropertyField>
                {metadata?.index && <PropertyField name="Index" content={metadata.index}/>}
                <PropertyField name="Type"
                               content={<EventTypeTag event={event} />}/>
                <PropertyField name="Insert time"
                               content={<DateValue date={event?.metadata?.time?.insert}/>}
                />
                <PropertyField name="Status"
                               content={<><EventStatusTag label={event?.metadata?.status}/>
                                   <EventValidation eventMetaData={event?.metadata}/>
                                   <EventWarnings eventMetaData={event?.metadata}/>
                                   <EventErrorTag eventMetaData={event?.metadata}/>
                               </>}/>
                {event.journey.state && <PropertyField name="Journey state"
                               content={<EventJourneyTag>{event.journey.state}</EventJourneyTag>}/>}
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}
                {event?.source && <PropertyField name="Event source" content={event.source.id} drawerSize={820}>
                    {allowedDetails.includes("source") && <EventSourceDetails id={event.source.id}/>}
                </PropertyField>}
                <PropertyField name="Tags"
                               content={Array.isArray(event?.tags?.values) &&
                               <TuiTags tags={event.tags.values} size="small"/>}
                />
                {Array.isArray(event?.metadata?.processed_by?.rules) && <PropertyField
                    name="Routed by rules"
                    content={<TuiTags tags={event.metadata?.processed_by?.rules} size="small"/>}/>}

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <Tabs tabs={["Data", "Traits", "Properties", "Context"]}>
                <TabCase id={0}>
                    <section style={{margin: 20}}>
                        {!isEmptyObjectOrNull(event?.data) ? <EventDataTable event={event}/> :
                            <NoData header="No indexed data">
                                This event does not have any indexed data.
                            </NoData>}
                    </section>
                </TabCase>
                <TabCase id={1}>
                    {!isEmptyObjectOrNull(event?.traits) ? <TuiFormGroupContent><EventTraits/></TuiFormGroupContent> :
                        <NoData header="No traits">
                            This event does not have any traits.
                        </NoData>}
                </TabCase>
                <TabCase id={2}>
                    {!isEmptyObjectOrNull(event?.properties) ? <TuiFormGroupContent><EventProperties/></TuiFormGroupContent> :
                        <NoData header="No properties">
                            This event does not have any properties.
                        </NoData>}
                </TabCase>
                <TabCase id={3}>
                    {!isEmptyObjectOrNull(event?.context) ? <TuiFormGroupContent><ContextInfo/></TuiFormGroupContent> :
                        <NoData header="No context">
                            This event does not have any context data.
                        </NoData>}
                </TabCase>
            </Tabs>
        </TuiFormGroup>
    </TuiForm>
}

export default function EventInfo({id, allowedDetails}) {

    const {isLoading, data, error} = useFetch(
        ["event", [id]],
        getEventById(id),
        (data) => {
            return data
        }
    )

    if (error) {
        return <FetchError error={error}/>
    }

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return <EventDataDetails event={data?.event}
                             metadata={data?._metadata}
                             allowedDetails={allowedDetails}/>
}
import React, {useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
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
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import IconLabel from "../misc/IconLabels/IconLabel";
import NoData from "../misc/NoData";


const EventDataDetails = ({event, allowedDetails=[]}) => {

    const ContextInfo = () => {
        const context = object2dot(event?.context);
        return <>{Object.keys(context).map(key => <PropertyField key={key} name={key} content={context[key]}/>)}</>
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event?.properties);
        return <>{Object.keys(eventProperties).map(key => <PropertyField key={key} name={key}
                                                                         content={eventProperties[key]}/>)}</>
    }

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event details"/>
            <TuiFormGroupContent style={{display: "flex", flexDirection: "column"}}>
                <PropertyField name="Id" content={<IdLabel label={event?.id}/>}>
                    <EventDetails event={event}/>
                </PropertyField>
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
                {event?.session && <PropertyField name="Session id" content={event.session?.id}>

                </PropertyField>}
                {event?.source && <PropertyField name="Event source" content={event.source.id} drawerSize={820}>
                    {allowedDetails.includes("source") && <EventSourceDetails id={event.source.id}/>}
                </PropertyField>}
                <PropertyField name="Tags"
                               content={Array.isArray(event?.tags?.values) && <TuiTags tags={event.tags.values} size="small"/>}
                />
                {Array.isArray(event?.metadata?.processed_by?.rules) && <PropertyField name="Routed by rules"
                                                                                       content={<TuiTags tags={event.metadata?.processed_by?.rules} size="small"/>}/>}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Properties"/>
            {!isEmptyObjectOrNull(event?.properties) ? <TuiFormGroupContent><EventProperties/></TuiFormGroupContent> : <NoData header="No properties">
                    This event does not have any properties.
                </NoData>}
        </TuiFormGroup>

        {!isEmptyObjectOrNull(event?.context) && <TuiFormGroup>
            <TuiFormGroupHeader header="Context"/>
            <TuiFormGroupContent>
                <ContextInfo/>
            </TuiFormGroupContent>
        </TuiFormGroup>}
    </TuiForm>
}

export default function EventInfo({id, allowedDetails}) {

    const [event,setEvent] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    React.useEffect(() => {
        let isSubscribed = true;
        setError(null);
        setLoading(true);
        if (id) {
            asyncRemote({
                url: "/event/" + id
            })
                .then(response => {
                    if (isSubscribed && response?.data) {
                        setEvent(response.data?.event);
                    }
                })
                .catch(e => {
                    if (isSubscribed) setError(getError(e))
                })
                .finally(() => {
                    if (isSubscribed) setLoading(false)
                })
        }
        return () => isSubscribed = false;
    }, [id])

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <EventDataDetails event={event} allowedDetails={allowedDetails}/>
}
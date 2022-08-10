import React, {useEffect} from "react";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import EventProfilingDetails from "./EventProfilingDetails";
import EventLogDetails from "./EventLogDetails";
import ProfileLogDetails from "./ProfileLogDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import {BsXSquare, BsCheckCircle} from "react-icons/bs";
import {object2dot} from "../../../misc/dottedObject";
import {isEmptyObjectOrNull, isObject} from "../../../misc/typeChecking";
import EventStatusTag from "../misc/EventStatusTag";
import Button from "../forms/Button";
import {MdUnfoldLess, MdUnfoldMore} from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";
import ProfileRawData from "./ProfileRawData";
import PropertyField from "./PropertyField";
import ProfileInfo from "./ProfileInfo";
import NoData from "../misc/NoData";

const SessionContextInfo = ({sessionId}) => {

    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [displaySessionContext, setDisplaySessionContext] = React.useState(false);

    useEffect(() => {
        let isSubscribed = true;

        if (displaySessionContext) {
            setSession(null);
            setError(null);
            setLoading(true);
            if (sessionId) {
                asyncRemote({
                    url: "/session/" + sessionId
                })
                    .then(response => {
                        if (isSubscribed && response?.data) {
                            setSession(response.data);
                        }
                    })
                    .catch(e => {
                        let code = 500
                        if (e?.response) {
                            code = e.response.status
                        }

                        if (isSubscribed) setError({code: code, errors: getError(e)})
                    })
                    .finally(() => {
                        if (isSubscribed) setLoading(false)
                    })
            }

        }

        return () => isSubscribed = false;

    }, [sessionId, displaySessionContext])

    const Content = ({session}) => {
        const sessionContext = object2dot(session?.context);
        return Object.keys(sessionContext).map(key => <PropertyField key={key}
                                                                     name={key}
                                                                     content={sessionContext[key]}/>)
    }

    if (error) {
        if(error.code === 404) {
            return <NoData header="Missing session">This event has no session. Can not retrieve context data.</NoData>
        }
        return <ErrorsBox errorList={error.errors}/>
    }

    return <>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            {!isObject(session)
                ? <Button label="Display session context"
                          icon={<MdUnfoldMore size={20}/>}
                          onClick={() => setDisplaySessionContext(true)}/>
                : <Button label="Hide session context"
                          icon={<MdUnfoldLess size={20}/>}
                          onClick={() => {setDisplaySessionContext(false); setSession(null)}}/>}
        </div>
        {loading && <div style={{marginTop:10}}><LinearProgress/></div>}
        {isObject(session) && displaySessionContext && <Content session={session}/>}
    </>


};

export const EventData = ({event}) => {

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
        {!isEmptyObjectOrNull(event?.properties) && <TuiFormGroup>
            <TuiFormGroupHeader header="Properties"/>
            <TuiFormGroupContent>
                <EventProperties/>
            </TuiFormGroupContent>
        </TuiFormGroup>}
        {!isEmptyObjectOrNull(event?.context) && <TuiFormGroup>
            <TuiFormGroupHeader header="Context"/>
            <TuiFormGroupContent>
                <ContextInfo/>
                <div style={{marginTop: 20}}>
                    {event?.session?.id && <SessionContextInfo sessionId={event?.session?.id}/>}
                </div>

            </TuiFormGroupContent>
        </TuiFormGroup>}
        <TuiFormGroup>
            <TuiFormGroupHeader header="Metadata"/>
            <TuiFormGroupContent>
                <PropertyField name="Type" content={event?.type}/>
                <PropertyField name="Event source" content={event?.source?.id}/>
                <PropertyField name="Status"
                               content={<EventStatusTag label={event?.metadata?.status}/>}/>
                <PropertyField name="Debug" content={event?.metadata?.debug ?
                    <BsCheckCircle size={20} color="#00c853"/> : <BsXSquare size={20} color="#d81b60"/>}/>
                <PropertyField name="Profile less" content={event?.metadata?.profile_less ?
                    <BsCheckCircle size={20} color="#00c853"/> : <BsXSquare size={20} color="#d81b60"/>}/>
                <PropertyField name="Updated time"
                               content={event?.update ? <BsCheckCircle size={20} color="#00c853"/> :
                                   <BsXSquare size={20} color="#d81b60"/>}/>
                <PropertyField name="Insert time"
                               content={typeof event?.metadata?.time?.insert === "string" && `${event.metadata.time.insert.substring(0, 10)} ${event.metadata.time.insert.substring(11, 19)}`}
                />
                <PropertyField name="Tags"
                               content={Array.isArray(event?.tags?.values) && event.tags.values.join(", ")}
                />
                <PropertyField name="Routed by rules"
                               content={Array.isArray(event?.metadata?.processed_by?.rules) && event.metadata.processed_by.rules.join(", ")}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default function EventDetails({event, metadata}) {

    const [tab, setTab] = React.useState(0);


    const tabs = ["Event", "Raw", "Flow debug", "Flow logs"];
    if (event?.profile?.id) {
        tabs.push("Profile logs");
        tabs.push("Profile");
        tabs.push("Raw profile");
    }

    return <>
        <Tabs
            sx={{margin: 20}}
            className="EventTabs"
            tabs={tabs}
            defaultTab={tab}
            onTabSelect={setTab}
            tabContentStyle={{overflow: "auto"}}
            tabsStyle={{
                margin: 20,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                marginTop: 0,
                marginBottom: 0,
                position: "sticky",
                top: 0,
                zIndex: 2
            }}
        >
            <TabCase id={0}>
                <EventData event={event}/>
            </TabCase>
            <TabCase id={1}>
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Raw event"/>
                        <TuiFormGroupContent>
                            <div style={{margin: 10}}>
                                <ObjectInspector data={{event:event, _metadata: metadata}} expandLevel={5}/>
                            </div>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={2}>
                <TuiForm style={{margin: 20, height: "inherit"}}>
                    <TuiFormGroup style={{height: "inherit"}}>
                        <TuiFormGroupHeader header="Flow profiling"
                                            description="Workflow process debug information for selected event."/>
                        <TuiFormGroupContent style={{height: "100%"}}>
                            <EventProfilingDetails eventId={event?.id}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={3}>
                <TuiForm style={{margin: 20, height: "inherit"}}>
                    <TuiFormGroup style={{height: "inherit"}}>
                        <TuiFormGroupHeader header="Logs"
                                            description="Workflow logs for selected event."/>
                        <TuiFormGroupContent style={{height: "100%"}}>
                            <EventLogDetails eventId={event?.id}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={4}>
                <TuiForm style={{margin: 20, height: "inherit"}}>
                    <TuiFormGroup style={{height: "inherit"}}>
                        <TuiFormGroupHeader header="Profile logs"
                                            description="Profile logs for selected event."/>
                        <TuiFormGroupContent style={{height: "100%"}}>
                            <ProfileLogDetails profileId={event?.profile?.id}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={5}>
                <ProfileInfo id={event?.profile?.id}/>
            </TabCase>
            <TabCase id={6}>
                <ProfileRawData id={event?.profile?.id}/>
            </TabCase>
        </Tabs>
    </>
}

EventDetails.propTypes = {
    data: PropTypes.object,
};
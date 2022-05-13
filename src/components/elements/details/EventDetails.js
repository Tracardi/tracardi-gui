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
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";
import {BsXSquare, BsCheckCircle} from "react-icons/bs";
import {object2dot} from "../../../misc/dottedObject";
import {isEmptyObjectOrNull, isObject} from "../../../misc/typeChecking";
import EventStatusTag from "../misc/EventStatusTag";
import Button from "../forms/Button";
import {MdUnfoldLess, MdUnfoldMore} from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";

const EventInfoField = ({name, content}) => {
    return (
        <div
            style={{
                overflowWrap: "anywhere",
                overflow: "none",
                paddingTop: "15px",
                paddingBottom: "10px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                fontSize: "16px",
                fontWeight: 400
            }}
        >
            <div style={{
                fontSize: "16px",
                fontWeight: 600,
                maxWidth: "330px",
                minWidth: "330px",
            }}
            >
                {name}
            </div>
            <div>
                {content && React.isValidElement(content)
                    ? content
                    : isObject(content) || content === "" || !content
                        ? '<empty>'
                        : content}
            </div>
        </div>
    );
}

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
                        if (isSubscribed) setError(getError(e))
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
        return Object.keys(sessionContext).map(key => <EventInfoField key={key}
                                                                      name={key}
                                                                      content={sessionContext[key]}/>)
    }

    if (error) {
        return <ErrorsBox errorList={error}/>
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

export default function EventDetails({data}) {

    const [tab, setTab] = React.useState(0);


    const tabs = ["Event", "Raw", "Flow debug", "Flow logs"];
    if (data?.event?.profile?.id) {
        tabs.push("Profile logs");
        tabs.push("Profile");
        tabs.push("Raw profile");
    }


    const ProfileDetails = ({id}) => {

        const [profile, setProfile] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState(null);
        const [pii, setPii] = React.useState(null);
        const [privateTraits, setPrivateTraits] = React.useState(null);
        const [publicTraits, setPublicTraits] = React.useState(null);

        React.useEffect(() => {
            let isSubscribed = true;
            setError(null);
            setLoading(true);
            if (id) {
                asyncRemote({
                    url: "/profile/" + id
                })
                    .then(response => {
                        if (isSubscribed && response?.data) {
                            setProfile(response.data);
                            setPii(object2dot(response.data?.pii));
                            setPrivateTraits(object2dot(response.data?.traits?.private));
                            setPublicTraits(object2dot(response.data?.traits?.public));
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
        }, [])

        if (error) {
            return <ErrorsBox errorList={error}/>
        }

        if (loading) {
            return <CenteredCircularProgress/>
        }

        return <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Profile info"
                                    description="Here you can check some basic profile info for this event."/>
                <TuiFormGroupContent>
                    <EventInfoField name="Visits" content={profile?.stats?.visits}/>
                    <EventInfoField name="Views" content={profile?.stats?.views}/>
                    <EventInfoField name="Consents"
                                    content={profile?.consents && Object.keys(profile?.consents).join(", ")}/>
                    <EventInfoField name="Active" content={profile?.active
                        ? <BsCheckCircle size={24} color="#00c853"/> :
                        <BsXSquare size={24} color="#d81b60"/>}
                    />
                    {pii && Object.keys(pii).map(key => <EventInfoField key={key}
                                                                        name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                        content={pii[key]}/>)}


                </TuiFormGroupContent>
            </TuiFormGroup>

            {privateTraits && !isEmptyObjectOrNull(privateTraits) && <TuiFormGroup>
                <TuiFormGroupHeader header="Private traits"
                                    description="Here you can check private traits of profile for selected event."/>
                <TuiFormGroupContent>

                    {Object.keys(privateTraits).map(key => <EventInfoField key={key}
                                                                           name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                           content={privateTraits[key]}/>)}

                </TuiFormGroupContent>
            </TuiFormGroup>}

            {privateTraits && !isEmptyObjectOrNull(privateTraits) && <TuiFormGroup>
                <TuiFormGroupHeader header="Public traits"
                                    description="Here you can check public traits of profile for selected event."/>
                <TuiFormGroupContent>

                    {publicTraits && Object.keys(publicTraits).map(key => <EventInfoField key={key}
                                                                                          name={(key.charAt(0).toUpperCase() + key.slice(1)).replace("_", " ")}
                                                                                          content={publicTraits[key]}/>)}
                </TuiFormGroupContent>
            </TuiFormGroup>}
        </TuiForm>
    }

    const ProfileInfo = ({id}) => {

        const [profile, setProfile] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState(null);

        React.useEffect(() => {
            let isSubscribed = true;
            if (isSubscribed) setError(null);
            if (isSubscribed) setLoading(true);
            if (id) {
                asyncRemote({
                    url: "/profile/" + id
                })
                    .then(response => setProfile(response.data))
                    .catch(e => setError(getError(e)))
                    .finally(() => setLoading(false))
            }
            return () => isSubscribed = false;
        }, [])

        if (error) {
            return <ErrorsBox errorList={error}/>
        }

        if (loading) {
            return <CenteredCircularProgress/>
        }

        return <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Profile"
                                    description="Profile that triggered this event."/>

                <div style={{margin: 10}}><ObjectInspector data={profile} expandLevel={5}/></div>
                }
            </TuiFormGroup>
        </TuiForm>
            ;
    };

    const ContextInfo = () => {
        const context = object2dot(data?.event?.context);
        return <>{Object.keys(context).map(key => <EventInfoField key={key} name={key} content={context[key]}/>)}</>;
    };

    const EventProperties = () => {
        const eventProperties = object2dot(data?.event?.properties);
        return <>{Object.keys(eventProperties).map(key => <EventInfoField key={key} name={key}
                                                                          content={eventProperties[key]}/>)}</>;
    };

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
                <TuiForm style={{margin: 20}}>
                    {!isEmptyObjectOrNull(data?.event?.properties) && <TuiFormGroup>
                        <TuiFormGroupHeader header="Properties"/>
                        <TuiFormGroupContent>
                            <EventProperties/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>}
                    {!isEmptyObjectOrNull(data?.event?.context) && <TuiFormGroup>
                        <TuiFormGroupHeader header="Context"/>
                        <TuiFormGroupContent>
                            <ContextInfo/>
                            <div style={{marginTop: 20}}>
                                {data?.event?.session?.id && <SessionContextInfo sessionId={data?.event?.session?.id}/>}
                            </div>

                        </TuiFormGroupContent>
                    </TuiFormGroup>}
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Metadata"/>
                        <TuiFormGroupContent>
                            <EventInfoField name="Type" content={data?.event?.type}/>
                            <EventInfoField name="Event source" content={data?.event?.source?.id}/>
                            <EventInfoField name="Status"
                                            content={<EventStatusTag label={data?.event?.metadata?.status}/>}/>
                            <EventInfoField name="Debug" content={data?.event?.metadata?.debug ?
                                <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}/>
                            <EventInfoField name="Profile less" content={data?.event?.metadata?.profile_less ?
                                <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}/>
                            <EventInfoField name="Updated time"
                                            content={data?.event?.update ? <BsCheckCircle size={24} color="#00c853"/> :
                                                <BsXSquare size={24} color="#d81b60"/>}/>
                            <EventInfoField name="Insert time"
                                            content={typeof data?.event?.metadata?.time?.insert === "string" && `${data.event.metadata.time.insert.substring(0, 10)} ${data.event.metadata.time.insert.substring(11, 19)}`}
                            />
                            <EventInfoField name="Tags"
                                            content={Array.isArray(data?.event?.tags?.values) && data.event.tags.values.join(", ")}
                            />
                            <EventInfoField name="Routed by rules"
                                            content={Array.isArray(data?.event?.metadata?.processed_by?.rules) && data.event.metadata.processed_by.rules.join(", ")}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>

            </TabCase>
            <TabCase id={1}>
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Raw event" description="Here you can check raw event object."/>
                        <TuiFormGroupContent>
                            <div style={{margin: 10}}>
                                <ObjectInspector data={data?.event} expandLevel={5}/>
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
                            <EventProfilingDetails eventId={data?.event?.id}/>
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
                            <EventLogDetails eventId={data?.event?.id}/>
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
                            <ProfileLogDetails profileId={data?.event?.profile?.id}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={5}>
                <ProfileDetails id={data?.event?.profile?.id}/>
            </TabCase>
            <TabCase id={6}>
                <ProfileInfo id={data?.event?.profile?.id}/>
            </TabCase>
        </Tabs>
    </>

}

EventDetails.propTypes = {
    data: PropTypes.object,
};
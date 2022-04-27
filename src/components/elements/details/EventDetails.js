import React from "react";
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
import SessionStepper from "../steppers/SessionStepper";
import { object2dot } from "../../../misc/dottedObject";

export default function EventDetails({data}) {

    const [tab, setTab] = React.useState(0);

    const tabs = ["Event", "Session", "Context", "Raw", "Flow debug", "Flow logs"];
    if (!data.event.metadata.profile_less) {
        tabs.push("Profile logs");
        tabs.push("Profile");
    };

    const ProfileInfo = () => {

        const [profile, setProfile] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState(null);

        React.useEffect(() => {
            let isSubscribed = true;
            if (isSubscribed) setError(null);
            if (isSubscribed) setLoading(true);
            asyncRemote({
                url: "/profile/" + data.event.profile.id
            })
            .then(response => setProfile(response.data))
            .catch(e => setError(getError(e)))
            .finally(() => setLoading(false))
            return () => isSubscribed = false;
        }, [])


        return <>
        {loading ? <CenteredCircularProgress /> : <div style={{margin: 10}}><ObjectInspector data={profile} expandLevel={5}/></div>}
        {error && <ErrorsBox errorList={error} />}
        </>;
    };

    const ContextInfo = () => {
        const context = object2dot(data.event.context);
        return <>{Object.keys(context).map(key => <EventInfoField key={key} name={key} content={context[key]} />)}</>;
    };

    const EventProperties = () => {
        const eventProperties = object2dot(data.event.properties);
        return <>{Object.keys(eventProperties).map(key => <EventInfoField key={key} name={key} content={eventProperties[key]} />)}</>;
    };

    const EventInfoField = ({name, content}) => {
        return (
            <div
                style={{
                    overflow: "auto",
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
                <div>{typeof content === "object" ? content : content.toString()}</div>
            </div>
        );
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
                    <TuiForm style={{margin: 20}}> 
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event" description="Basic event information"/>
                            <TuiFormGroupContent>
                                <EventInfoField name="Type" content={data.event.type}/>
                                <EventInfoField name="Event source" content={data.event.source.id} />
                                <EventInfoField name="Status" content={data.event.metadata.status} />
                                <EventInfoField name="Debug" content={data.event.metadata.debug ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>} />
                                <EventInfoField name="Profile less" content={data.event.metadata.profile_less ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>} />
                                <EventInfoField 
                                    name="Insert" 
                                    content={typeof data.event.metadata.time.insert === "string" && `${data.event.metadata.time.insert.substring(0, 10)} ${data.event.metadata.time.insert.substring(11, 19)}`} 
                                />
                                <EventInfoField name="Tags"
                                    content={Array.isArray(data.event.tags.values) && data.event.tags.values.join(", ")}
                                />
                                <EventInfoField name="Processed by rules" content={Array.isArray(data.event.metadata.processed_by.rules) && data.event.metadata.processed_by.rules.join(", ")}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                    <TuiForm style={{margin: 20}}> 
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event properties" description="Here you can check properties of selected event."/>
                            <TuiFormGroupContent>
                                <EventProperties />
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={1}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Session" description="Here you can inspect session that selected event belongs to." />
                            <TuiFormGroupContent>
                                <SessionStepper session={{...data.event.session, insert: data.event.session.start}}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={2}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event context" description="Here you can check context of selected event." />
                            <TuiFormGroupContent>
                                <ContextInfo />
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={3}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Raw event" description="Here you can check raw event object." />
                            <TuiFormGroupContent>
                                <div style={{margin: 10}}>
                                    <ObjectInspector data={data.event} expandLevel={5} />
                                </div>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={4}>
                    <TuiForm style={{margin: 20, height: "inherit"}}>
                        <TuiFormGroup style={{height: "inherit"}}>
                            <TuiFormGroupHeader header="Flow profiling" description="Here you can check worfklow process info for selected event."/>
                            <TuiFormGroupContent style={{height: "100%"}}>
                                <EventProfilingDetails eventId={data.event.id}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={5}>
                    <TuiForm style={{margin: 20, height: "inherit"}}>
                        <TuiFormGroup style={{height: "inherit"}}>
                            <TuiFormGroupHeader header="Logs" description="Here you can check node executing logs for selected event."/>
                            <TuiFormGroupContent style={{height: "100%"}}>
                                <EventLogDetails eventId={data.event.id}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={6}>
                    <TuiForm style={{margin: 20, height: "inherit"}}>
                        <TuiFormGroup style={{height: "inherit"}}>
                            <TuiFormGroupHeader header="Profile logs" description="Here you can inspect profile logs for selected event."/>
                            <TuiFormGroupContent style={{height: "100%"}}>
                                <ProfileLogDetails profileId={data.event.profile.id}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={7}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Profile" description="Here you can inspect profile that triggered this event."/>
                            <ProfileInfo />
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
        </Tabs>
    </>

}

EventDetails.propTypes = {
    data: PropTypes.object,
  };
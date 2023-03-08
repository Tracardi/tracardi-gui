import React from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import EventProfilingDetails from "./EventProfilingDetails";
import EventLogDetails from "./EventLogDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventData from "./EventData";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import JsonBrowser from "../misc/JsonBrowser";
import {useFetch} from "../../../remote_api/remoteState";
import {getEventById} from "../../../remote_api/endpoints/event";
import FetchError from "../../errors/FetchError";

export default function EventDetails({event, metadata}) {

    const [tab, setTab] = React.useState(0);

    const tabs = ["Event", "Raw", "Flow debug", "Event logs"];

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
                marginTop: 0,
                marginBottom: 0,
                position: "sticky",
                top: 0,
                zIndex: 2
            }}
        >
            <TabCase id={0}>
                <EventData event={event} metadata={metadata} allowedDetails={['profile', 'source', 'session']}/>
            </TabCase>
            <TabCase id={1}>
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Raw event"/>
                        <TuiFormGroupContent>
                            <div style={{margin: 10}}>
                                <JsonBrowser data={{event: event, _metadata: metadata}} />
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
        </Tabs>
    </>
}

export function EventDetailsById({id}) {

    const query = useFetch(
        ["getEvent", [id]],
        getEventById(id),
        data => {
            return data
        })

    if(query.isError) {
        if(query.error.status === 404)
            return <NoData header="Could not find event.">
                This can happen if the event was deleted or archived.
            </NoData>
        return <FetchError error={query.error}/>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <EventDetails event={query.data.event} metadata={query.data._metadata}/>}
    </>
}

EventDetailsById.propTypes = {
    id: PropTypes.string,
};

EventDetails.propTypes = {
    data: PropTypes.object,
};
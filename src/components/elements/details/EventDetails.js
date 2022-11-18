import React from "react";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import EventProfilingDetails from "./EventProfilingDetails";
import EventLogDetails from "./EventLogDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventData from "./EventData";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import theme from "../../../themes/inspector_light_theme";

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
                backgroundColor: "white",
                marginTop: 0,
                marginBottom: 0,
                position: "sticky",
                top: 0,
                zIndex: 2
            }}
        >
            <TabCase id={0}>
                <EventData event={event} allowedDetails={['profile', 'source', 'session']}/>
            </TabCase>
            <TabCase id={1}>
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Raw event"/>
                        <TuiFormGroupContent>
                            <div style={{margin: 10}}>
                                <ObjectInspector data={{event: event, _metadata: metadata}} theme={theme} expandLevel={5}/>
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

    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [noData, setNoData] = React.useState(false);

    React.useEffect(() => {
        let isSubscribed = true;
        setNoData(false)
        setError(null);
        setLoading(true);
        if (id) {
            asyncRemote({
                url: "/event/" + id
            })
                .then(response => setEvent(response.data?.event))
                .catch(e => {
                    if(isSubscribed) {
                        if(e.request && e.request.status === 404) {
                            setNoData(true)
                        } else {
                            setError(getError(e))
                        }
                    }
                })
                .finally(() => {if(isSubscribed) setLoading(false)})
        }
        return () => isSubscribed = false;
    }, [id])

    if(noData) {
        return <NoData header="Could not find event.">
            This can happen if the event was deleted or archived.
        </NoData>
    }

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {event && <EventDetails data={event}/>}
    </>
}

EventDetailsById.propTypes = {
    id: PropTypes.string,
};

EventDetails.propTypes = {
    data: PropTypes.object,
};
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
                                <ObjectInspector data={{event: event, _metadata: metadata}} expandLevel={5}/>
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

EventDetails.propTypes = {
    data: PropTypes.object,
};
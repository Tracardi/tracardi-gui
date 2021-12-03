import React from "react";
import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import Properties from "./DetailProperties";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import EventProfilingDetails from "./EventProfilingDetails";
import EventLogDetails from "./EventLogDetails";
import ProfileLogDetails from "./ProfileLogDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObject, isEmptyObjectOrNull} from "../../../misc/typeChecking";

export default function EventDetails({data}) {
    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Event", "Context", "Raw", "Flow debug", "Flow logs", "Profile logs"]}>
                <TabCase id={0}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event Metadata and Properties"/>
                            <TuiFormGroupContent>
                                {!isEmptyObject(data.event?.metadata) && <TuiFormGroupField header="Metadata">
                                    <Properties properties={data.event?.metadata}/>
                                </TuiFormGroupField>}
                                {!isEmptyObject(data.event?.properties) && <TuiFormGroupField header="Properties">
                                    <Properties properties={data.event?.properties}/>
                                </TuiFormGroupField>}
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event source" description="Displays the resource the event data was collected from."/>
                            <TuiFormGroupContent>
                                {!isEmptyObject(data.event?.source) && <TuiFormGroupField header="Source">
                                    <Properties properties={data.event?.source}/>
                                </TuiFormGroupField>}
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={1}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event context"/>
                            <TuiFormGroupContent>
                                {!isEmptyObjectOrNull(data?.event?.profile) && <TuiFormGroupField header="Profile">
                                    <Properties properties={data?.event?.profile}/>
                                </TuiFormGroupField>}
                                {!isEmptyObjectOrNull(data?.event?.session?.context?.page) && <TuiFormGroupField header="Page">
                                    <Properties properties={data?.event?.session?.context?.page}/>
                                </TuiFormGroupField>}
                                {!isEmptyObjectOrNull(data?.event?.session?.context?.browser) && <TuiFormGroupField header="Browser">
                                    <Properties properties={data?.event?.session?.context?.browser}/>
                                </TuiFormGroupField>}
                                {!isEmptyObjectOrNull(data?.event?.session?.context?.screen) && <TuiFormGroupField header="Screen">
                                    <Properties properties={data?.event?.session?.context?.screen}/>
                                </TuiFormGroupField>}
                                {!isEmptyObjectOrNull(data?.event?.session?.context?.storage) && <TuiFormGroupField header="Storage">
                                    <Properties properties={data?.event?.session?.context?.storage}/>
                                </TuiFormGroupField>}
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                        {!isEmptyObjectOrNull(data?.event?.aux) && <TuiFormGroup>
                            <TuiFormGroupHeader header="Event auxiliary data"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupField header="Auxiliary data">
                                    <Properties properties={data?.event?.aux}/>
                                </TuiFormGroupField>
                            </TuiFormGroupContent>
                        </TuiFormGroup>}
                    </TuiForm>
                </TabCase>
                <TabCase id={2}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event context"/>
                            <TuiFormGroupContent>
                                <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={3}>
                    <div style={{margin:20, height: 'inherit'}}>
                        <EventProfilingDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={4}>
                    <div style={{margin:20, height: 'inherit'}}>
                        <EventLogDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={5}>
                    <div style={{margin:20, height: 'inherit'}}>
                        <ProfileLogDetails profileId={data?.event?.profile?.id}
                                           sessionProfileId={data?.event?.session?.profile?.id}/>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

EventDetails.propTypes = {
    data: PropTypes.object,
  };
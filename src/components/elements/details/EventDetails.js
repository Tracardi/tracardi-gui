import React, {useEffect, useState} from "react";
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
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";

export default function EventDetails({data}) {


    const ProfileRawData = ({profileId}) => {

        const [errors, setErrors] = useState(null)
        const [loading, setLoading] = useState(false)
        const [profileData, setProfileData] = useState({})

        useEffect(() => {
            let isSubscribed = true
            setLoading(true);
            asyncRemote({
                url: `/profile/${profileId}`
            }).then((response)=>{
                if(response && isSubscribed===true) {
                    setErrors(null);
                    setProfileData(response?.data);
                }
            }).catch((e) => {
                if(isSubscribed === true) setErrors(getError(e))
            }).finally(() => {
                if(isSubscribed === true) setLoading(false)
            })
            return () => isSubscribed = false
        }, [profileId])

        return <>
            {errors && <ErrorsBox errorList={errors}/>}
            {loading && <CenteredCircularProgress/>}
            {errors === null && profileData && <ObjectInspector data={profileData} theme={theme} expandLevel={3}/>}
            </>
    }

    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Event", "Context", "Raw", "Flow debug", "Flow logs", "Profile logs", "Profile"]}>
                <TabCase id={0}>
                    <TuiForm style={{padding: 20}}>
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
                    <TuiForm style={{padding: 20}}>
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
                    <TuiForm style={{padding: 20}}>
                        <TuiFormGroup>
                            <TuiFormGroupHeader header="Event raw data"/>
                            <TuiFormGroupContent>
                                <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
                <TabCase id={3}>
                    <div style={{padding:20, height: 'inherit'}}>
                        <EventProfilingDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={4}>
                    <div style={{padding:20, height: 'inherit'}}>
                        <EventLogDetails eventId={data?.event?.id}/>
                    </div>
                </TabCase>
                <TabCase id={5}>
                    <div style={{padding:20, height: 'inherit'}}>
                        <ProfileLogDetails profileId={data?.event?.profile?.id}
                                           sessionProfileId={data?.event?.session?.profile?.id}/>
                    </div>
                </TabCase>
                <TabCase id={6}>
                    <TuiForm style={{padding: 20}}>
                            <TuiFormGroup>
                                <TuiFormGroupHeader header="Profile raw data" description="This is current profile state. Not the state when the event was collected."/>
                                <TuiFormGroupContent>
                                    <ProfileRawData profileId={data?.event?.profile?.id}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

EventDetails.propTypes = {
    data: PropTypes.object,
  };
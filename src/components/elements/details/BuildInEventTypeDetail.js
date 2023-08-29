import React from "react";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import {getBuildInEventType} from "../../../remote_api/endpoints/system";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {CopyBlock, tomorrow} from "react-code-blocks";
import {objectMap} from "../../../misc/mappers";
import AssignValueToKey from "./AssignValueToKey";
import NoData from "../misc/NoData";
import TuiTags from "../tui/TuiTags";
import TuiTipBox from "../tui/TuiTipBox";

function EventTrackerScript({type, properties}) {

    const props = JSON.stringify(properties,null, "                    ")
    const script = `window.tracker.track(
        "${type}", 
        ${props}
);`
    return <CopyBlock
        text={script}
        language="javascript"
        theme={tomorrow}
        codeBlock
    />;
}


export default function BuildInEventTypeDetail({id}) {

    const {isLoading, data, error} = useFetch(
        ["buildInEventTypes"],
        getBuildInEventType(id),
        (data) => {
            return data
        }
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header={`Event type: ${data.name}`} description={data.description}/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Usage and Expected Properties"
                                   description="This is the example of usage.">

                    {data.explain && <TuiTipBox>{data.explain}</TuiTipBox>}

                    <p>
                        You can choose which properties to include, as they are all optional. If you don't want
                        to send a specific key and its value, you can simply delete it. If any property is missing,
                        it won't be processed, and you won't receive any error messages.
                    </p>
                    <EventTrackerScript type={data.id} properties={data.properties}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event mapping"
                                   description="How properties are mapped to event data or traits.">
                    <p>
                        Event mapping helps to make data easy to find by creating a structure that organizes the data.
                        This structure is made by copying information from the different parts of the event and
                        putting it into a specific format that can be used to analyze and group the data.
                        This is particularly helpful when dealing with unstructured data that needs to
                        be organized in order to be useful.

                        This table describes which event property will be copied to event data or traits.
                    </p>
                    {data.copy ?
                        objectMap(data.copy, (key, value) => {
                            return <AssignValueToKey key={key} value={`event@${value}`} label={`event@${key}`} op="moves to"/>
                        }) : <NoData header="No event mapping">Event properties are not indexed and stay in event@properties..</NoData>
                    }
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Profile mapping"
                                   description="Profile mapping explains how event data is connected to a profile.
                                   When an event is sent, the information linked to it can be automatically
                                   copied and stored in specific profile properties. To see exactly which
                                   fields get copied, you can refer to the table below.">
                    {data.profile ?
                            objectMap(data.profile, (key, value) => {
                            return <AssignValueToKey key={key} value={`profile@${key}`} label={`event@${value[0]}`} op={value[1]}/>
                        }) : <NoData header="No profile mapping">Event properties are not copied to profile.</NoData>
                    }
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event tagging"
                                   description={`Event ${data.id} will be tagged with the following tag.`}>
                    <TuiTags tags={data.tags} style={{margin: 2}}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>


}

BuildInEventTypeDetail.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};
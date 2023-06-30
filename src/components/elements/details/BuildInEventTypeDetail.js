import React from "react";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import {getBuildInEventType} from "../../../remote_api/endpoints/system";
import Properties from "./DetailProperties";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import Rows from "../misc/Rows";
import Button from "../forms/Button";
import {VscEdit, VscTrash} from "react-icons/vsc";
import JsonBrowser from "../misc/JsonBrowser";


export default function BuildInEventTypeDetail({id}) {
    console.log(id)
    const {isLoading, data, error} = useFetch(
        ["buildInEventTypes"],
        getBuildInEventType(id),
        (data) => {
            return data
        }
    )
    console.log(id, data)
    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header={`Event type: ${data.name}`} description={data.description}/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Expected properties"
                                   description="Properties that can be sent with this event type.">
                    <JsonBrowser data={data.properties}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event mapping"
                                   description="How properties are mapped to event data or traits.">
                    <JsonBrowser data={data.copy}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {data.profile && <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Profile mapping"
                                   description="How event data is mapped to profile.">
                    <JsonBrowser data={data.profile}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>}
    </TuiForm>


}

BuildInEventTypeDetail.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};
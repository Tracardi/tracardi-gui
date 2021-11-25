import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import {ObjectInspector} from "react-inspector";
import theme from "../../themes/inspector_light_theme";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import React from "react";

export default function ResponseForm({loading, request, response}) {
    return <TuiForm className="RequestResponse">
        <TuiFormGroup>
            <TuiFormGroupHeader header="Request"
                                description="Request is the data payload that was send to Tracardi for processing."/>
            <TuiFormGroupContent>
                <ObjectInspector data={request} theme={theme} expandLevel={3}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Response"
                description="Response is a data that is send back from Tracardi it may include profile and some debugging information on how the processing of data went."/>
            <TuiFormGroupContent>
                {!loading && <ObjectInspector data={response} theme={theme} expandLevel={3}/>}
                {loading && <CenteredCircularProgress/>}
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiSelectMultiEventType from "../tui/TuiSelectMultiEventType";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import TuiFormError from "../tui/TuiFormError";
import Button from "./Button";
import React, {useState} from "react";

export default function SchedulerJobForm() {

    const [cronValue, setCronValue] =  useState(false);
    const [processing, setProcessing] =  useState(false);
    const [type, setType] =  useState("");

    const handleSubmit = () => {

    }

    const handleError = (e) => {
        console.log(e)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Scheduled event"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Bind this segment event type. You can select
                None then segment will be checked at every event. against all events.">
                    <TuiSelectMultiEventType value={type} onSetValue={setType}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}
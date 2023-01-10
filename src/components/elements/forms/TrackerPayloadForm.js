import React, {useState} from "react";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import "./TrackerPayloadEventList.css";
import ListOfEventPayloads from "./ListOfEventPayloads";

export default function TrackerPayloadForm({onChange, value, profileLess, style}) {

    if (!value) {
        value = {
            source: {
                id: null,
            },
            context: {},
            properties: {},
            events: [],
            options: {},
            profile_less: profileLess || false
        }
    }

    const [data, setData] = useState(value);

    const handleChange = (value) => {
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    const handleListChange = (value) => {
        value = {...data, events: value}
        setData(value)
        handleChange(value)
    }

    const handleSourceChange = (value) => {
        value = {...data, source: {id: value.id}}
        setData(value)
        handleChange(value)
    }

    return <TuiForm style={style}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Tracker payload"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Source"
                                   description="Select event source though which the data will be collected.">
                    <TuiSelectEventSource value={data.source} onSetValue={handleSourceChange}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Events" description="Add events to tracker payload.">
                    <ListOfEventPayloads
                        value={value.events}
                        onChange={handleListChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

TrackerPayloadForm.propTypes = {onChange: PropTypes.func, value: PropTypes.object}
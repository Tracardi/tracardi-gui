import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {v4 as uuid4} from 'uuid';
import TextField from "@mui/material/TextField";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import EventToProfileFieldMapping from "./EventToProfileFieldMapping";
import Switch from "@mui/material/Switch";

export default function IdentificationPointForm({data: _data, onSubmit}) {

    if (!_data) {
        _data = {
            id: uuid4(),
            name: "",
            description: "",
            source: {
                id: "",
                name: ""
            },
            event_type: {
                id: "",
                name: ""
            },
            fields:[ {event_property: {value:"", ref: true}, profile_trait: {value:"", ref: true}} ],
            settings: {
                conflict_aux_field: "conflict"
            },
            enabled: false
        }
    }

    const [data, setData] = useState(_data);

    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [eventTypeErrorMessage, setEventTypeErrorMessage] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSave = async () => {
        setNameErrorMessage(null)
        setEventTypeErrorMessage(null)

        if (data.name === "" || data?.event_type?.id === "") {
            if (data.name === "") {
                setNameErrorMessage("Please set name")
            }

            if (data?.event_type?.id === "") {
                setEventTypeErrorMessage("Set event type.")
            }
        } else {

            setProcessing(true);

            try {
                const response = await asyncRemote({
                    url: '/identification/point',
                    method: 'post',
                    data: data
                })

                if (response?.data && mounted.current) {
                    if (onSubmit) {
                        onSubmit(data)
                    }
                }

            } catch (e) {
                if (e && mounted.current) {
                    setError(getError(e))
                }
            } finally {
                if (mounted.current) {
                    setProcessing(false);
                }
            }
        }
    }

    const handleChange = (key, value) => {
        const _value = {...data, [key]: value}

        setData(_value)
        if (key === "event_type" && value?.id) {
            setEventTypeErrorMessage(null)
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField variant="outlined"
                               label="Name"
                               value={data.name}
                               error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                               helperText={nameErrorMessage}
                               FormHelperTextProps={{style: {color: "#d81b60"}}}
                               onChange={(ev) => {
                                   handleChange("name", ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Identification point description. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Description"
                               multiline
                               rows={5}
                               value={data.description}
                               onChange={(ev) => {
                                   handleChange("description", ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Identification Point Settings"
                                description="Identification point is an event type in the customer journey that allows
                                you to identify customer. When an identification point is set system will match events
                                with profiles that have selected fields and will merge anonymous profile with
                                identified customer."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event source"
                            description="Select event source if you want to limit identification to selected event
                            sources. Leave blank if you would like identification to be performed
                            regardless of the event source. "
                >
                    <TuiSelectEventSource
                        value={data?.source}
                        onSetValue={v => handleChange("source", v)}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event type" description="To use this feature, you must first select an
                event type. The identification process will trigger for the event type that you have selected.">
                    <TuiSelectEventType onlyValueWithOptions={false}
                                        initValue={data?.event_type}
                                        errorMessage={eventTypeErrorMessage}
                                        onSetValue={v => handleChange("event_type", v)}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Identification data fields" description="Type the location of the data that
                will be used to identify customer. Customer will data will be loaded if the data from event matches
                the data in profile. Eg. profile 'pii.email' is equal to e-mail delivered in event property
                'mail'. If any of the set pairs match the profile will be attached to the event.">
                    <EventToProfileFieldMapping value={data?.fields} onChange={v => handleChange("fields", v)}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Enable">
                    <Switch
                        checked={data?.enabled}
                        onChange={(ev) => handleChange('enabled', ev.target.checked)}
                    />
                    <span>
                        Enable identification point
                    </span>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save"
                onClick={handleSave}
                error={nameErrorMessage !== null}
                progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

IdentificationPointForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func
}

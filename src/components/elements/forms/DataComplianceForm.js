import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {v4 as uuid4} from 'uuid';
import TextField from "@mui/material/TextField";
import DataComplianceSettings from "./DataComplianceSettings";
import ErrorBox from "../../errors/ErrorBox";

export default function DataComplianceForm({data: _data, onSaveComplete}) {

    if (!_data) {
        _data = {
            id: uuid4(),
            name: "",
            description: "Data compliance enforcement for event: type-event-type",
            event_type: "",
            settings: []
        }
    }

    const [data, setData] = useState(_data);

    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [eventTypeErrorMessage, setEventTypeErrorMessage] = useState(null);
    const [settingsErrorMessage, setSettingsErrorMessage] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSave = async () => {
        setError(null)
        setNameErrorMessage(null)
        setSettingsErrorMessage(null)
        setEventTypeErrorMessage(null)
        console.log(data.name === "", data.settings.length === 0, !data?.event_type?.id, data?.event_type?.id )
        if (data.name === "") {
            setNameErrorMessage("Please set name")
        } else if (data.settings.length === 0) {
            setSettingsErrorMessage("Data compliance without rules has no effect. Add some rules.")
        } else if (!data?.event_type?.id) {
            console.log("sss", eventTypeErrorMessage)
            setEventTypeErrorMessage("Set event type.")
        } else {
            setProcessing(true);

            try {
                const response = await asyncRemote({
                    url: '/consent/compliance/field',
                    method: 'post',
                    data: data
                })

                if (response?.data && mounted.current) {
                    if (onSaveComplete) {
                        onSaveComplete(data)
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
        if (key === "settings") {
            setSettingsErrorMessage(null)
        }
        if (key === "event_type" && value?.id) {
            setEventTypeErrorMessage(null)
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField variant="outlined"
                               label="Compliance name"
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
                                   description="Compliance description. Be as descriptive as possible.">
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
            <TuiFormGroupHeader header="Event properties compliance settings" description="This form allows you to set rules for
            data compliance for a specific event type, based on the customer consents that have been granted."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="To use this feature, you must first select an
                event type. The rules you set will only be enforced for the event type that you have selected.">
                    <TuiSelectEventType onlyValueWithOptions={false}
                                        initValue={data?.event_type}
                                        errorMessage={eventTypeErrorMessage}
                                        onSetValue={v => handleChange("event_type", v)}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Compliance rules" description="A list of event properties that must comply
                with the customer consents. If an event property is present and the customer did not provide any of the required
                consents, the rule will enforce selected action. Each row represents one event property. Click add if there aren't any rules.">
                    {settingsErrorMessage && <ErrorBox>{settingsErrorMessage}</ErrorBox>}
                    <DataComplianceSettings
                        value={data?.settings}
                        onChange={(v) => handleChange("settings", v)}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save"
                onClick={handleSave}
                error={nameErrorMessage !== null || settingsErrorMessage!==null || eventTypeErrorMessage!==null}
                progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

DataComplianceForm.propTypes = {
    data: PropTypes.object,
    onSaveComplete: PropTypes.func
}

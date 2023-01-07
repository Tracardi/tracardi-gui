import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import {v4 as uuid4} from 'uuid';

import TextField from "@mui/material/TextField";

export default function DataComplianceForm({data: _data, onSaveComplete}) {

    if (!_data) {
        _data = {
            name: "Data compliance enforcement for event: type-event-type",
            event_type: "",
            settings: "{\"properties.some_field\": {\"consent_id\": \"\", \"action\": \"remove\" }}"
        }
    }

    const [data, setData] = useState(_data);

    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        const payload = {...data, id: uuid4(), settings: JSON.parse(data.settings)}

        setProcessing(true);

        try {
            const response = await asyncRemote({
                url: '/consent/compliance/field',
                method: 'post',
                data: payload
            })

            if (response?.data && mounted.current) {
                if (onSaveComplete) {
                    onSaveComplete(payload)
                }
            }

        } catch (e) {
            if (e && mounted.current) {
                setError(getError(e))
                // todo error;
            }
        } finally {
            if(mounted.current) {
                setProcessing(false);
            }
        }
    }

    const handleJsonChange = (value) => {
        setData(value)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Compliance name">
                    <TextField variant="outlined"
                               label="Compliance name"
                               value={data.name}
                               error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                               helperText={nameErrorMessage}
                               onChange={(ev) => {
                                   setData({...data, name: ev.target.value})
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Select event type.">
                    <TuiSelectEventType onlyValueWithOptions={false} onSetValue={v => setData({...data, event_type: v})}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Compliance setting" description="Data compliance with customer consents.">
                    <JsonEditor value={data.settings} onChange={handleJsonChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

DataComplianceForm.propTypes = {
    data: PropTypes.string,
    onSubmit: PropTypes.func
}

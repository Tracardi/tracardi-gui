import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import Switch from "@mui/material/Switch";

export default function EventToProfileForm({
                                               id,
                                               name: _name,
                                               description: _description,
                                               event_type: _eventType,
                                               event_to_profile: _indexSchema,
                                               enabled: _indexEnabled,
                                               tags: _tags,
                                               onSaveComplete
                                           }) {

    const [name, setName] = useState(_name || "");
    const [description, setDescription] = useState(_description || "");
    const [eventType, setEventType] = useState(_eventType ? {
        id: _eventType,
        name: _eventType
    } : null);
    const [tags, setTags] = useState(_tags || []);
    const [copingSchema, setCopingSchema] = useState(JSON.stringify(_indexSchema, null, " ") || "{}");
    const [enabled, setEnabled] = useState(_indexEnabled || false);
    const [processing, setProcessing] = useState(false);

    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [error, setError] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        if (!name || !eventType?.id) {
            if (name.length === 0) {
                setNameErrorMessage("Name can not be empty");
            } else {
                setNameErrorMessage("");
            }
            if (!eventType?.id) {
                setTypeErrorMessage("Event type can not be empty");
            } else {
                setTypeErrorMessage("");
            }
            return;
        }

        try {

            const payload = {
                id: (id) ? id : uuid4(),
                name: name,
                description: description,
                event_type: eventType.id,
                event_to_profile: JSON.parse(copingSchema),
                enabled: enabled,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
            }

            setProcessing(true);

            const response = await asyncRemote({
                url: '/event-to-profile',
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
            }
        } finally {
            if (mounted.current) {
                setProcessing(false);
            }
        }
    }

    const handleTagChange = (values) => {
        setTags(values)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type"
                                   description="Type or select the type of event you want to copy data from.">
                    <TuiSelectEventType initValue={eventType}
                                        onSetValue={setEventType}
                                        onlyValueWithOptions={false}
                                        errorMessage={typeErrorMessage}/>
                </TuiFormGroupField>

                <TuiFormGroupField header="Name"
                                   description="Type name of this schema, e.g Copy purchase data.">
                    <TextField variant="outlined"
                               label="Name"
                               value={name}
                               error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                               helperText={nameErrorMessage}
                               onChange={(ev) => {
                                   setName(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Be as descriptive as possible. E.g. Copies: name, price and quantity.">
                    <TextField variant="outlined"
                               label="Schema description"
                               multiline
                               rows={5}
                               value={description}
                               onChange={(ev) => {
                                   setDescription(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Schema tags"
                                   description="Tag the schema to group it into meaningful groups.">
                    <TuiTagger tags={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Copy data from event to profile"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="What should be copied"
                                   description="Select which event items should be copied to the profile.
                                   Type key, value pair with the key as event data (e.g. property.email) and value as
                                   the profile data (e.g. pii.email)">
                    <Switch
                        checked={enabled}
                        onChange={(ev) => setEnabled(ev.target.checked)}
                    />
                    <span>
                        Enable event to profile coping
                    </span>
                    <fieldset disabled={!enabled}>
                        <legend>Coping schema</legend>
                        <JsonEditor value={copingSchema} onChange={setCopingSchema}/>
                    </fieldset>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventToProfileForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    onSaveComplete: PropTypes.func
}

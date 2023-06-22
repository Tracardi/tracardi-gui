import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import TuiTagger from "../tui/TuiTagger";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import Switch from "@mui/material/Switch";
import DocsLink from "../drawers/DocsLink";
import RemoteService from "../../../remote_api/endpoints/raw";
import FetchError from "../../errors/FetchError";
import EventToProfileCopy from "./EventToProfileCopy";

export default function EventToProfileForm({
                                               id,
                                               name: _name,
                                               description: _description,
                                               event_type: _eventType,
                                               event_to_profile: _indexSchema,
                                               config: _config,
                                               enabled: _indexEnabled,
                                               tags: _tags,
                                               onSubmit
                                           }) {

    const [name, setName] = useState(_name || "");
    const [description, setDescription] = useState(_description || "");
    const [eventType, setEventType] = useState(_eventType || null);
    const [tags, setTags] = useState(_tags || []);
    const [copingSchema, setCopingSchema] = useState(_indexSchema || []);
    const [enabled, setEnabled] = useState(_indexEnabled || false);
    const [processing, setProcessing] = useState(false);
    const [config, setConfig] = useState(_config);

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
                event_type: eventType,
                event_to_profile: copingSchema,
                config: config,
                enabled: enabled,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
            }

            setProcessing(true);

            await RemoteService.fetch({
                url: '/event-to-profile',
                method: 'post',
                data: payload
            })

            if (mounted.current) {
                if (onSubmit) {
                    onSubmit(payload)
                }
            }

        } catch (e) {
            if (e && mounted.current) {
                setError(e)
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

    const hasErrors = () => {
        return nameErrorMessage !== "" || typeErrorMessage !== ""
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>

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
                <TuiFormGroupField header="Mapping tags"
                                   description="Tag the mapping to group it into meaningful groups.">
                    <TuiTagger tags={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Profile mapping" description="Profile data mapping to event properties.
            This setting will let you copy data from event to profile"/>
            <TuiFormGroupContent>
                <Switch
                    checked={enabled}
                    onChange={(ev) => setEnabled(ev.target.checked)}
                />
                <span>Enable mapping</span>
                <TuiFormGroupField header="Event type"
                                   description="Type or select the type of event you want to copy data from.">
                    <TuiSelectEventType initValue={eventType}
                                        onSetValue={setEventType}
                                        onlyValueWithOptions={false}
                                        errorMessage={typeErrorMessage}/>
                </TuiFormGroupField>

                <TuiFormGroupField header="Trigger condition" description={
                    <span>Set the condition that must be met to start data coping. You may leave this field empty
                        if all the events must be processed.
                    <DocsLink src="http://docs.tracardi.com/notations/logic_notation/"> How to write a
                        condition </DocsLink></span>
                }>
                    <TextField
                        label={"Condition"}
                        value={config?.condition || ""}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setConfig({...config, condition: ev.target.value})
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>

                <TuiFormGroupField header="What should be copied to profile"
                                   description='To copy event items to your profile, choose a profile data e.g. "pii.email" you would like to override and
                                   a type for example event property, e.g."properties.email". If the email address does not exist in the event, it will not be copied and you
                                   will get a warning.'>
                    <EventToProfileCopy value={copingSchema} onChange={setCopingSchema}/>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <FetchError error={error} style={{marginBottom: 10}}/>}

        <Button label="Save"
                onClick={onSave}
                progress={processing}
                style={{justifyContent: "center"}}
                error={hasErrors()}
        />
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

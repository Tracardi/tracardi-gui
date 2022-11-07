import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import TuiSelectEventType from "../tui/TuiSelectEventType";

export default function EventMetadataForm({
                                                id,
                                                name: _name,
                                                description: _description,
                                                event_type: _eventType,
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

    const [processing, setProcessing] = useState(false);

    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [descErrorMessage, setDescErrorMessage] = useState("");
    const [error, setError] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        if (!name || !description) {
            if (name.length === 0) {
                setNameErrorMessage("Name can not be empty");
            } else {
                setNameErrorMessage("");
            }
            if (description.length === 0) {
                setDescErrorMessage("Description can not be empty");
            } else {
                setDescErrorMessage("");
            }
            return;
        }

        try {

            const payload = {
                id: (id) ? id : uuid4(),
                name: name,
                description: description,
                event_type: eventType.id,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
            }

            setProcessing(true);

            const response = await asyncRemote({
                url: '/event-type/management',
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
                                   description="Type or select the type of event you want to manage.">
                    <TuiSelectEventType value={eventType} onSetValue={setEventType}/>
                </TuiFormGroupField>

                <TuiFormGroupField header="Name"
                                   description="Type name of the event type. E.g. User page view.">
                    <TextField variant="outlined"
                               label="Human readable event type"
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
                                   description="Event type description. Be as descriptive as possible. E.g. Fires when user visits a web page.">
                    <TextField variant="outlined"
                               label="Event type description"
                               multiline
                               rows={5}
                               value={description}
                               onChange={(ev) => {
                                   setDescription(ev.target.value)
                               }}
                               error={(typeof descErrorMessage !== "undefined" && descErrorMessage !== '' && descErrorMessage !== null)}
                               helperText={descErrorMessage}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Event type tags"
                                   description="Tag the event types to group it into meaningful groups.">
                    <TuiTagger tags={tags}  onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventMetadataForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    onSaveComplete: PropTypes.func
}

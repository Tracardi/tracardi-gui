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
import DocsLink from "../drawers/DocsLink";
import JsonEditor from "../editors/JsonEditor";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";

export default function EventRedirectForm({
                                              id,
                                              name: _name,
                                              description: _description,
                                              url: _url,
                                              props: _props,
                                              event_type: _eventType,
                                              source: _eventSource,
                                              tags: _tags,
                                              onSaveComplete
                                          }) {

    const [name, setName] = useState(_name || "");
    const [description, setDescription] = useState(_description || "");
    const [url, setUrl] = useState(_url || "");
    const [props, setProps] = useState(JSON.stringify(_props, null, '  ') || "{}");
    const [eventType, setEventType] = useState(_eventType ? {
        id: _eventType,
        name: _eventType
    } : null);
    const [eventSource, setEventSource] = useState(_eventSource || {
        id: "",
        name: ""
    });
    const [tags, setTags] = useState(_tags || []);

    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [urlErrorMessage, setUrlErrorMessage] = useState("");
    const [eventTypeErrorMessage, setEventTypeErrorMessage] = useState("")

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        if (!url || !name || !eventType) {
            if (url.length === 0) {
                setUrlErrorMessage("Url can not be empty");
            } else {
                setUrlErrorMessage("");
            }

            if (name.length === 0) {
                setNameErrorMessage("Name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if (!eventType) {
                setEventTypeErrorMessage("Name can not be empty");
            } else {
                setEventTypeErrorMessage("");
            }

            return;
        }

        try {

            const payload = {
                id: (id) ? id : uuid4(),
                name: name,
                description: description,
                url: url,
                props: JSON.parse(props),
                event_type: eventType.id,
                source: eventSource,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
            }

            setProcessing(true);

            const response = await asyncRemote({
                url: '/event-redirect',
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
            <TuiFormGroupHeader header="Redirect description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Type redirect name. Be as descriptive as possible.">
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
                                   description="Redirection description. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Description"
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
                <TuiFormGroupField header="Event type tags"
                                   description="Tag the event types to group it into meaningful groups.">
                    <TuiTagger tags={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Redirect configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Source"
                                   description="Select event source through which you would like to collect the event.">
                    <TuiSelectEventSource value={eventSource}
                                        onlyValueWithOptions={true}
                                        onSetValue={setEventSource}
                                        label="Source"/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event type"
                                   description="Type or select the type of event you want to register.">
                    <TuiSelectEventType value={eventType}
                                        errorMessage={eventTypeErrorMessage}
                                        onlyValueWithOptions={false}
                                        onSetValue={setEventType}
                                        label="event type"/>
                </TuiFormGroupField>

                <TuiFormGroupField header="URL"
                                   description="Type Url you would like to redirect to.">

                    <TextField variant="outlined"
                               label="URL"
                               value={url}
                               error={(typeof urlErrorMessage !== "undefined" && urlErrorMessage !== '' && urlErrorMessage !== null)}
                               helperText={urlErrorMessage}
                               onChange={(ev) => {
                                   setUrl(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Event properties"
                                   description={<>
                                   <span>Type properties of the event. This object will be sent as event properties.
                                       Use object template to reference data. </span><DocsLink
                                       src="http://docs.tracardi.com/notations/object_template/"> Do you need
                                       help? </DocsLink>
                                   </>}>

                    <fieldset style={{marginTop: 10}}>
                        <legend>Event Properties Schema</legend>
                        <JsonEditor value={props} onChange={(value) => setProps(value)} autocomplete={true}/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save"
                error={urlErrorMessage || nameErrorMessage}
                onClick={onSave}
                progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventRedirectForm.propTypes = {
    id: PropTypes.string,
    url: PropTypes.string,
    props: PropTypes.string,
    event_type: PropTypes.string,
    tags: PropTypes.array,
    onSaveComplete: PropTypes.func
}

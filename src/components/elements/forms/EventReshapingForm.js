import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from "uuid";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import TuiTagger from "../tui/TuiTagger";

export default function EventReshapingForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: uuid4(),
            name: "",
            description: "",
            event_type: "",
            tags: [],
            reshaping: {
                reshape_schema: {},
                condition: ""
            }
        }
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [eventType, setEventType] = useState(init.event_type);
    const [tags, setTags] = useState(init.tags);
    const [reshapeSchema, setReshapeSchema] = useState(JSON.stringify(init.reshaping?.reshape_schema, null, '  '));
    const [condition, setCondition] = useState(init.reshaping?.condition);

    const [error, setError] = useState(null);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);

    const [processing, setProcessing] = useState(false);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Event reshaping name can not be empty");
            } else {
                setNameErrorMessage(null);
            }

            return;
        }

        try {
            setProcessing(true);
            setError(null);
            console.log(reshapeSchema)
            const payload = {
                id: (!init?.id) ? uuid4() : init.id,
                name: name,
                description: description,
                event_type: eventType,
                tags: tags,
                reshaping: {
                    reshape_schema: (reshapeSchema === "") ? {} : JSON.parse(reshapeSchema),
                    condition: condition
                }
            }

            const response = await asyncRemote(
                {
                    url: '/event-reshape-schema',
                    method: 'post',
                    data: payload
                }
            )
            if (response) {
                if (onSubmit) {
                    onSubmit(payload)
                }
            }
        } catch (e) {
            if (e) {
                if (mounted.current) setError(getError(e));
            }
        } finally {
            if (mounted.current) setProcessing(false);
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Describe event reshaping"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Name"}
                        error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                        helperText={nameErrorMessage}
                        value={name}
                        onChange={(ev) => {
                            setName(ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you to understand when the event reshaping is applied.">
                    <TextField
                        label={"Description"}
                        value={description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setDescription(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                    <TuiTagger tags={tags} onChange={setTags}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Reshaping Logic & Schema"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Set the event type that will be reshaped.">
                    <TuiSelectEventType
                        label={"Event type"}
                        value={eventType}
                        onSetValue={(event) => setEventType(event.id)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Triggering condition" description="Set the condition that must be met to
                start reshaping">
                    <TextField
                        label={"Condition"}
                        value={condition}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setCondition(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Reshaping schema" description="Set reshaping schema. ">
                    <fieldset style={{marginTop: 10}}>
                        <legend>Schema</legend>
                        <JsonEditor value={reshapeSchema} onChange={(value) => setReshapeSchema(value)} autocomplete={true}/>
                    </fieldset>
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" error={error || nameErrorMessage} onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventReshapingForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
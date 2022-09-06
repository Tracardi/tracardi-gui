import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import JsonEditor from "../editors/JsonEditor";
import TuiSelectEventType from "../tui/TuiSelectEventType";

export default function EventManagementForm({
                                                id,
                                                name: validationName,
                                                description: validationDescription,
                                                validation,
                                                event_type: validationEventType,
                                                tags: validationTags,
                                                reshaping,
                                                onSaveComplete
                                            }) {

    const [name, setName] = useState(validationName || "");
    const [description, setDescription] = useState(validationDescription || "");
    const [validationSchema, setValidationSchema] = useState((validation?.json_schema) ? JSON.stringify(validation.json_schema, null, '  ') : null);
    const [reshapeTemplate, setReshapeTemplate] = useState((reshaping?.template) ? JSON.stringify(reshaping.template, null, '  ') : null)
    const [reshapeCondition, setReshapeCondition] = useState((reshaping?.condition) ? reshaping.condition : "")
    const [enabled, setEnabled] = useState(validation?.enabled || false);
    const [eventType, setEventType] = useState(validationEventType ? {
        id: validationEventType,
        name: validationEventType
    } : null);
    const [tags, setTags] = useState(validationTags || []);

    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [descErrorMessage, setDescErrorMessage] = useState("");
    const [validationErrorMessage, setValidationErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const [reshapeConditionErrorMessage, setReshapeConditionErrorMessage] = useState("");
    const [reshapeTemplateError, setReshapeTemplateError] = useState("");

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {
        try {
            setValidationErrorMessage("")
            if (enabled === true) {
                if (validationSchema === "" || validationSchema === null) {
                    setValidationErrorMessage("Json schema validation can not be empty. Disable validation or fill this field.")
                    return
                }
                validation = JSON.parse(validationSchema)
            } else if (!validation) {
                validation = {}
            }

        } catch (e) {
            setValidationErrorMessage(e.toString())
            return;
        }

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

        if (reshapeCondition) {
            try {
                await asyncRemote({
                    url: "/tql/validate",
                    method: "POST",
                    data: reshapeCondition
                })
            } catch (e) {
                setReshapeConditionErrorMessage("Given condition is invalid.");
                return;
            }
        }

        let template = {};
        try {
            template = JSON.parse(reshapeTemplate);
        } catch (e) {
            setReshapeTemplateError(e.toString());
            return;
        }

        try {

            const payload = {
                id: (id) ? id : uuid4(),
                name: name,
                description: description,
                validation: {json_schema: validation, enabled: enabled},
                event_type: eventType.id,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
                reshaping: {template: template, condition: reshapeCondition}
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
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event type validation settings"/>
            <TuiFormGroupContent>


                <TuiFormGroupField header="JSON-schema validation"
                                   description="Type the validation in JSON-schema. Please refer to documentation for the format of JSON-schema.">
                    <fieldset style={{borderColor: (validationErrorMessage) ? "red" : "#ccc"}}>
                        <legend style={{color: (validationErrorMessage) ? "red" : "#aaa"}}>JSON-schema validation
                        </legend>
                        <JsonEditor value={validationSchema} onChange={setValidationSchema}/>
                        {validationErrorMessage && <div style={{color: "red"}}>{validationErrorMessage}</div>}
                    </fieldset>
                </TuiFormGroupField>
                <TuiFormGroupField header="Enable validation"
                                   description="Disabled validation schemas will not be triggered.">
                    <FormControlLabel
                        style={{marginLeft: 2}}
                        control={
                            <Checkbox
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Enable validation schema"
                    />
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event type reshaping settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Reshape condition"
                                   description="Please type the condition that will make the reshaping happen if evaluated to true value. You can reference profile, session and event itself. 
                                   You can leave it empty for the reshaping to be always performed.">
                    <TextField variant="outlined"
                               label="Condition"
                               value={reshapeCondition}
                               error={(typeof reshapeConditionErrorMessage !== "undefined" && reshapeConditionErrorMessage !== '' && reshapeConditionErrorMessage !== null)}
                               helperText={reshapeConditionErrorMessage}
                               onChange={(ev) => {
                                   setReshapeCondition(ev.target.value);
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Reshape template"
                                   description="Type your reshape template here. This will replace event properties after replacing all present paths with appropriate values 
                                   (or null, if they do not exist). You can reference profile and session as well. Reshaping is performed after JSON-schema validation. Leave this field empty to 
                                   not perform any reshaping.">
                    <fieldset style={{borderColor: (reshapeTemplateError) ? "red" : "#ccc"}}>
                        <legend style={{color: (reshapeTemplateError) ? "red" : "#aaa"}}>Reshape template
                        </legend>
                        <JsonEditor value={reshapeTemplate} onChange={setReshapeTemplate}/>
                        {reshapeTemplateError && <div style={{color: "red"}}>{reshapeTemplateError}</div>}
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventManagementForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    reshaping: PropTypes.object,
    onSaveComplete: PropTypes.func
}

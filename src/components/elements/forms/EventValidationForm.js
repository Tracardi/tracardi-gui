import TextField from "@material-ui/core/TextField";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import JsonEditor from "../editors/JsonEditor";
import TuiSelectEventType from "../tui/TuiSelectEventType";

export default function EventValidationForm({
                                                id,
                                                name: validationName,
                                                description: validationDescription,
                                                enabled: validationEnabled,
                                                validation,
                                                event_type: validationEventType,
                                                tags: validationTags,
                                                onSaveComplete
                                            }) {

    const [name, setName] = useState(validationName || "");
    const [description, setDescription] = useState(validationDescription || "");
    const [validationSchema, setValidationSchema] = useState((validation) ? JSON.stringify(validation, null, '  ') : null);
    const [enabled, setEnabled] = useState(validationEnabled || false);
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

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        try {
            if (validationSchema === null) {
                throw new Error("Validation schema can not be empty");
            }
            validation = JSON.parse(validationSchema)
            setValidationErrorMessage("")
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

        try {

            const payload = {
                id: (id) ? id : uuid4(),
                name: name,
                description: description,
                validation: validation,
                enabled: enabled,
                event_type: eventType.id,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"]
            }

            setProcessing(true);

            const response = await asyncRemote({
                url: '/event/validation-schema',
                method: 'post',
                data: payload
            })

            if (response?.data) {
                if (onSaveComplete) {
                    onSaveComplete(payload)
                }
            }

        } catch (e) {
            if (e) {
                setError(getError(e))
            }
        } finally {
            if (mounted) {
                setProcessing(false);
            }
        }
    }

    const handleTagChange = (values) => {
        setTags(values)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event validation schema description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name"
                                   description="Type validation schema name. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Validation schema name"
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
                                   description="Validation schema description. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Validation schema description"
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
                <TuiFormGroupField header="Validation tags"
                                   description="Tag the validation schema to group it into meaningful groups.">
                    <TuiTagger tags={tags} value={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Validation settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type"
                                   description="Type event-type to apply validation-schema on the event.
                                   Validation schemas are bind to event-types. If you change the event type on
                                   existing validation schema then new validation-schema will be created.">
                    <TuiSelectEventType value={eventType} onSetValue={setEventType}/>
                </TuiFormGroupField>
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
        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventValidationForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    onSaveComplete: PropTypes.func
}

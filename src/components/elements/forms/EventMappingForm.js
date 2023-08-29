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
import {MenuItem} from "@mui/material";

export default function EventMappingForm({
                                             id,
                                             name: _name,
                                             description: _description,
                                             event_type: _eventType,
                                             index_schema: _indexSchema,
                                             enabled: _indexEnabled,
                                             journey: _journey,
                                             tags: _tags,
                                             onSubmit
                                         }) {

    const [name, setName] = useState(_name || "");
    const [description, setDescription] = useState(_description || "");
    const [eventType, setEventType] = useState(_eventType ? {
        id: _eventType,
        name: _eventType
    } : null);
    const [journey, setJourney] = useState(_journey || "");
    const [tags, setTags] = useState(_tags || []);
    const [indexSchema, setIndexSchema] = useState(JSON.stringify(_indexSchema, null, " ") || "{}");
    const [indexEnabled, setIndexEnabled] = useState(_indexEnabled || false);
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
                index_schema: JSON.parse(indexSchema),
                enabled: indexEnabled,
                journey: journey,
                tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
            }

            setProcessing(true);

            const response = await asyncRemote({
                url: '/event-type/mapping',
                method: 'post',
                data: payload
            })

            if (response?.data && mounted.current) {
                if (onSubmit) {
                    onSubmit(payload)
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
                                   description="Type or select the type of event you want to map.">
                    <TuiSelectEventType initValue={eventType} onSetValue={setEventType} onlyValueWithOptions={false}/>
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
                    <TuiTagger tags={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event mapping"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header=" Enable event mapping" description="Only enabled mappings will be executed.">
                    <Switch
                        checked={indexEnabled}
                        onChange={(ev) => setIndexEnabled(ev.target.checked)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Event journey mapping" description="Map event type to customer journey.">
                    <TextField select
                               variant="outlined"
                               size="small"
                               label="Journey state"
                               value={journey}
                               style={{width: 150}}
                               onChange={(ev) => setJourney(ev.target.value)}
                    >
                        <MenuItem value="awareness">Awareness</MenuItem>
                        <MenuItem value="consideration">Consideration</MenuItem>
                        <MenuItem value="purchase">Purchase</MenuItem>
                        <MenuItem value="loyalty">Loyalty</MenuItem>
                        <MenuItem value="advocacy">Advocacy</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event data mapping"
                                   description="Event mapping lets you copy data between fields in event.
                                   This way you can index selected properties as event traits.
                                   Type key, value pair with the key as property name and value as trait name.
                                   If event was reshaped than use new reshaped properties.">


                    <fieldset disabled={!indexEnabled}>
                        <legend>Schema mapping</legend>
                        <JsonEditor value={indexSchema} onChange={setIndexSchema}/>
                    </fieldset>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventMappingForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    onSubmit: PropTypes.func
}

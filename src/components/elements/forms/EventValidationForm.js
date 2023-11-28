import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from "uuid";
import {getError} from "../../../remote_api/entrypoint";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import TuiTagger from "../tui/TuiTagger";
import Switch from "@mui/material/Switch";
import DocsLink from "../drawers/DocsLink";
import {useRequest} from "../../../remote_api/requestClient";
import ShowHide from "../misc/ShowHide";

export default function EventValidationForm({onSubmit, init}) {

    const defaultData = {
        id: uuid4(),
        name: "",
        description: "",
        event_type: "",
        tags: [],
        enabled: false,
        validation: {
            json_schema: {},
            condition: ""
        }
    }

    init = {
        ...defaultData,
        ...init
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [eventType, setEventType] = useState(init.event_type);
    const [tags, setTags] = useState(init.tags);
    const [enabled, setEnabled] = useState(init.enabled);
    const [jsonSchema, setJsonSchema] = useState(JSON.stringify(init.validation?.json_schema, null, '  '));
    const [condition, setCondition] = useState(init.validation?.condition);

    const [error, setError] = useState(null);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);

    const [processing, setProcessing] = useState(false);

    const mounted = React.useRef(false);
    const {request} = useRequest()

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Event validation schema name can not be empty");
            } else {
                setNameErrorMessage(null);
            }

            return;
        }

        try {
            setProcessing(true);
            setError(null);

            const payload = {
                id: (!init?.id) ? uuid4() : init.id,
                name: name,
                description: description,
                event_type: eventType,
                tags: tags,
                enabled: enabled,
                validation: {
                    json_schema: (jsonSchema === "") ? {} : JSON.parse(jsonSchema),
                    condition: condition
                }
            }

            const response = await request(
                {
                    url: '/event-validator',
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
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>}
                                   description="Description will help you to understand when the event validation is applied.">
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
                <TuiFormGroupField header="Active" description="Enable/disable validation.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabled}
                            onChange={(ev) => setEnabled(ev.target.checked)}
                        />
                    </div>
                </TuiFormGroupField>
                <ShowHide label="Tags">
                    <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                        <TuiTagger tags={tags} onChange={setTags}/>
                    </TuiFormGroupField>
                </ShowHide>

            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Validation Logic & Schema"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Set the event type that will be validated.">
                    <TuiSelectEventType
                        label={"Event type"}
                        initValue={eventType}
                        onSetValue={(event) => setEventType(event.id)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Validation schema" description={<>
                    {"Set validation schema. More on JsonSchema validation"} <DocsLink label="label" src="http://docs.tracardi.com/events/event_validation/"> in documentation </DocsLink> </>}>
                    <fieldset style={{marginTop: 10}}>
                        <legend>Schema</legend>
                        <JsonEditor value={jsonSchema} onChange={(value) => setJsonSchema(value)} autocomplete={true}/>
                    </fieldset>
                </TuiFormGroupField>

                <ShowHide label="Advanced Trigger Condition" style={{marginTop:20}}>
                    <TuiFormGroupField header="Trigger condition" description="Set the condition that must be met to
                start validation. Empty condition means validate defined event type.">
                        <TextField
                            label={"Condition"}
                            value={condition || ""}
                            multiline
                            rows={3}
                            onChange={(ev) => {
                                setCondition(ev.target.value)
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </TuiFormGroupField>
                </ShowHide>


            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" error={error || nameErrorMessage} onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventValidationForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
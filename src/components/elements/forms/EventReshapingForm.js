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
import Switch from "@mui/material/Switch";
import DocsLink from "../drawers/DocsLink";
import Tabs, {TabCase} from "../tabs/Tabs";

export default function EventReshapingForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: uuid4(),
            name: "",
            description: "",
            event_type: "",
            tags: [],
            enabled: false,
            reshaping: {
                reshape_schema: {},
                condition: ""
            }
        }
    }

    const [tab, setTab] = useState(0);
    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [eventType, setEventType] = useState(init.event_type);
    const [tags, setTags] = useState(init.tags);
    const [enabled, setEnabled] = useState(init.enabled);
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

            const payload = {
                id: (!init?.id) ? uuid4() : init.id,
                name: name,
                description: description,
                event_type: eventType,
                tags: tags,
                enabled: enabled,
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
                <TuiFormGroupField header="Active" description="Enable/disable reshaping.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabled}
                            onChange={(ev) => setEnabled(ev.target.checked)}
                        />
                    </div>
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
                <TuiFormGroupField header="Trigger condition" description={<>
                    <span>Set the condition that must be met to start reshaping.</span>
                    <DocsLink src="http://docs.tracardi.com/notations/logic_notation/"> How to write a condition </DocsLink>
                </>}>
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
                <TuiFormGroupField header="Reshaping event data" description={<span className="flexLine">
                    Reshape event data schema. If the event contains data that should be split between
                        different parts like session context, properties or event has a property that is a profile id,
                        then define the rules here. Use object template to reference data. <DocsLink src="http://docs.tracardi.com/notations/object_template/"> Do you need help with object templates? </DocsLink>
                </span>}>
                    <Tabs tabs={["Properties", "Session", "Profile"]} defaultTab={tab} onTabSelect={setTab}>
                        <TabCase id={0}>
                            <fieldset style={{marginTop: 10}}>
                                <legend>Event Properties Schema</legend>
                                <JsonEditor value={reshapeSchema} onChange={(value) => setReshapeSchema(value)} autocomplete={true}/>
                            </fieldset>
                        </TabCase>
                    </Tabs>

                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" error={error || nameErrorMessage} onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventReshapingForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
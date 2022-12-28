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
                reshape_schema: {
                    properties: null,
                    context: null,
                    session: null
                },
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
    const [eventPropertiesSchema, setEventPropertiesSchema] = useState(init.reshaping?.reshape_schema.properties ? JSON.stringify(init.reshaping?.reshape_schema.properties, null, '  ') : "");
    const [eventContextSchema, setEventContextSchema] = useState(init.reshaping?.reshape_schema.context ? JSON.stringify(init.reshaping?.reshape_schema.context, null, '  ') : "");
    const [sessionContextSchema, setSessionContextSchema] = useState(init.reshaping?.reshape_schema.session ? JSON.stringify(init.reshaping?.reshape_schema.session, null, '  ') : "");
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
                    reshape_schema: {
                        properties: (eventPropertiesSchema === "") ? null : JSON.parse(eventPropertiesSchema),
                        context: (eventContextSchema === "") ? null : JSON.parse(eventContextSchema),
                        session: (sessionContextSchema === "") ? null : JSON.parse(sessionContextSchema)
                    },
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
                        value={description || ""}
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
            <TuiFormGroupHeader header="Condition" description="If conditions set beneath are met then the reshaping
            process will start."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Set the event type that should be reshaped.">
                    <TuiSelectEventType
                        label={"Event type"}
                        value={eventType}
                        onSetValue={(event) => setEventType(event.id)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Trigger condition" description={<>
                    <span>Set the condition that must be met to start reshaping. You may leave it empty if none is required.</span>
                    <DocsLink src="http://docs.tracardi.com/notations/logic_notation/"> How to write a
                        condition </DocsLink>
                </>}>
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
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Reshaping" description="Define how the event's data should look like."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Reshaping event data" description={<span className="flexLine">
                    Use object template to reference data. <DocsLink
                    src="http://docs.tracardi.com/notations/object_template/"> Do you need help with object templates? </DocsLink>
                </span>}>
                    <Tabs tabs={["Event Properties", "Event Context", "Session Context"]} defaultTab={tab}
                          onTabSelect={setTab}>
                        <TabCase id={0}>
                            <fieldset style={{marginTop: 10}}>
                                <legend>Event Properties Schema</legend>
                                <JsonEditor value={eventPropertiesSchema || ""}
                                            onChange={(value) => setEventPropertiesSchema(value)} autocomplete={true}/>
                            </fieldset>
                        </TabCase>
                        <TabCase id={1}>
                            <fieldset style={{marginTop: 10}}>
                                <legend>Event Context Schema</legend>
                                <JsonEditor value={eventContextSchema || ""}
                                            onChange={(value) => setEventContextSchema(value)} autocomplete={true}/>
                            </fieldset>
                        </TabCase>
                        <TabCase id={2}>
                            <fieldset style={{marginTop: 10}}>
                                <legend>Session Context Schema</legend>
                                <JsonEditor value={sessionContextSchema || ""}
                                            onChange={(value) => setSessionContextSchema(value)} autocomplete={true}/>
                            </fieldset>
                        </TabCase>
                    </Tabs>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Mapping" description="Event data may come from some device that is
                unaware of the tracardi payload schema. And there is no way yuo can change the data schema. But the data
                has for example a profile id or session that could be mapped to the system's profile id. Filling this
                mapping will join profile or session with the sent event."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Profile id location" description="If event data has profile id type its
                location. Use dot notation, eg. event@properties.userId">
                    <TextField
                        label="Profile id location"
                        value=""
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Session id location" description="If event data has session id type its
                location. Use dot notation, eg. event@properties.session">
                    <TextField
                        label="Session id location"
                        value=""
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" error={error || nameErrorMessage} onClick={handleSubmit} progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventReshapingForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
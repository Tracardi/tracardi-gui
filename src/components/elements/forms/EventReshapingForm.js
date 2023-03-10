import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from "uuid";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import TuiTagger from "../tui/TuiTagger";
import Switch from "@mui/material/Switch";
import DocsLink from "../drawers/DocsLink";
import Tabs, {TabCase} from "../tabs/Tabs";
import RefInput from "./inputs/RefInput";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import RemoteService from "../../../remote_api/endpoints/raw";
import FetchError from "../../errors/FetchError";

export default function EventReshapingForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: uuid4(),
            name: "",
            description: "",
            event_type: "",
            event_source: {name: "", id: ""},
            tags: [],
            enabled: false,
            reshaping: {
                reshape_schema: {
                    properties: null,
                    context: null,
                    session: null
                },
                condition: "",
                mapping: {
                    profile: {value: "", ref: true},
                    session: {value: "", ref: true},
                    event_type: {value: "", ref: true}
                }
            }
        }
    }

    const [tab, setTab] = useState(0);
    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [eventType, setEventType] = useState(init.event_type);
    const [eventSource, setEventSource] = useState(init.event_source);
    const [tags, setTags] = useState(init.tags);
    const [enabled, setEnabled] = useState(init.enabled);
    const [eventPropertiesSchema, setEventPropertiesSchema] = useState(init.reshaping?.reshape_schema.properties ? JSON.stringify(init.reshaping?.reshape_schema.properties, null, '  ') : "");
    const [eventContextSchema, setEventContextSchema] = useState(init.reshaping?.reshape_schema.context ? JSON.stringify(init.reshaping?.reshape_schema.context, null, '  ') : "");
    const [sessionContextSchema, setSessionContextSchema] = useState(init.reshaping?.reshape_schema.session ? JSON.stringify(init.reshaping?.reshape_schema.session, null, '  ') : "");
    const [condition, setCondition] = useState(init.reshaping?.condition);
    const [mapping, setMapping] = React.useState(init.reshaping?.mapping);

    const [error, setError] = useState(null);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);

    const [processing, setProcessing] = useState(false);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSetMapping = (type, value) => {
        setMapping({...mapping, [type]: value})
    }

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
                event_source: eventSource,
                tags: tags,
                enabled: enabled,
                reshaping: {
                    reshape_schema: {
                        properties: (eventPropertiesSchema === "") ? null : JSON.parse(eventPropertiesSchema),
                        context: (eventContextSchema === "") ? null : JSON.parse(eventContextSchema),
                        session: (sessionContextSchema === "") ? null : JSON.parse(sessionContextSchema)
                    },
                    condition: condition,
                    mapping: mapping
                }
            }

            await RemoteService.fetch(
                {
                    url: '/event-reshape-schema',
                    method: 'post',
                    data: payload
                }
            )

            if (onSubmit) {
                onSubmit(payload)
            }
        } catch (e) {
            if (mounted.current) setError(e);
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
                        initValue={eventType}
                        onSetValue={(event) => setEventType(event.id)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Event source" description="If the event must only come from a specific
                source, select it here. If left empty, all events will be reshaped regardless of their source.">
                    <TuiSelectEventSource
                        label={"Event source"}
                        value={eventSource}
                        onSetValue={setEventSource}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Trigger condition" description={
                    <span>Set the condition that must be met to start reshaping. You may leave this field empty if all the events must be reshaped.
                    <DocsLink src="http://docs.tracardi.com/notations/logic_notation/"> How to write a
                        condition </DocsLink></span>
                }>
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
            <TuiFormGroupHeader header="Reshaping" description="Define how the event's data should look like. In this
            section you can split the data between event and session and reshape its schema."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Reshaping event data" description={<span>
                    Reshaping is the process of changing the data schema. Track payload is the data that arrives at the
                    event collector and it can be filtered, and split into different parts. To do this, use an object
                    template, which creates a new schema where you can reference data from the raw payload. <DocsLink
                    src="http://docs.tracardi.com/notations/object_template/"> Do you need help with object templates? </DocsLink>
                </span>}>
                    <Tabs tabs={["Event Properties", "Event Context", "Session Context"]} defaultTab={tab}
                          onTabSelect={setTab}>
                        <TabCase id={0}>
                            <JsonEditor value={eventPropertiesSchema || ""}
                                        onChange={(value) => setEventPropertiesSchema(value)} autocomplete={true}/>
                        </TabCase>
                        <TabCase id={1}>
                            <JsonEditor value={eventContextSchema || ""}
                                        onChange={(value) => setEventContextSchema(value)} autocomplete={true}/>
                        </TabCase>
                        <TabCase id={2}>
                            <JsonEditor value={sessionContextSchema || ""}
                                        onChange={(value) => setSessionContextSchema(value)} autocomplete={true}/>
                        </TabCase>
                    </Tabs>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Mapping" description="Event data may come from some device that is
                unaware of the tracardi payload schema. And there is no way you can change the data schema. But the data
                may have a profile id or session that could be mapped to the system's profile id. Filling this
                section with proper mapping will join profile or session with the sent event."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Profile ID" description="Type location of profile id in the payload.
                Leave it empty if there is no profile id.">
                    <RefInput value={mapping?.profile}
                              onChange={(value) => handleSetMapping("profile", value)}
                              defaultType={true}
                              label="Location of profile ID"
                              locked={true}
                              fullWidth={true}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Session ID" description="Type location of session id in the payload.
                Leave it empty if there is no session id.">
                    <RefInput value={mapping?.session}
                              onChange={(value) => handleSetMapping("session", value)}
                              defaultType={true}
                              locked={true}
                              label="Location of session ID" fullWidth={true}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event type" description="Type location of event type in the payload.
                Leave it empty if there is no event type.">
                    <RefInput value={mapping?.event_type}
                              onChange={(value) => handleSetMapping("event_type", value)}
                              defaultType={true}
                              label="Location of event type"
                              fullWidth={true}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <FetchError error={error} style={{marginBottom: 10}}/>}
        <Button label="Save" error={error || nameErrorMessage} onClick={handleSubmit} progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

EventReshapingForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
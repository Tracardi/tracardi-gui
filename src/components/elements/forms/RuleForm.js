import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from 'uuid';
import PropTypes from 'prop-types';
import TuiSelectFlow from "../tui/TuiSelectFlow";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import TuiTagger from "../tui/TuiTagger";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiSelectMultiConsentType from "../tui/TuiSelectMultiConsentType";
import ShowHide from "../misc/ShowHide";
import MenuItem from "@mui/material/MenuItem";
import * as yup from 'yup';
import {getValueIfExists} from "../../../misc/values";
import {
    getRequiredEntityNameSchema,
    getRequiredStringSchema,
    validateYupSchema
} from "../../../misc/validators";
import AutoComplete from "./AutoComplete";
import {BsStar} from "react-icons/bs";

function SegmentTriggerForm({
                                data: _data,
                                properties: _properties,
                                errors,
                                onChange
                            }) {

    const [data, setData] = useState(_data)

    function setValue(key, value) {
        const d = {
            ...data,
            [key]: value
        }
        setData(d)
        if (onChange instanceof Function) {
            onChange(d)
        }
    }

    return <TuiFormGroupContent>
        <TuiFormGroupField header="Segment name"
                           description="Type segment name which will trigger the workflow when added.">

            <AutoComplete
                endpoint={{
                    url: '/segments/metadata'
                }}
                placeholder="Segment"
                value={data?.segment || {}}
                onlyValueWithOptions={false}
                initValue={data?.segment || {}}
                onSetValue={(value) => setValue('segment', value)}
                onChange={(value) => setValue('segment', value)}
                error={getValueIfExists(errors, 'segment.name')}
            />

        </TuiFormGroupField>
        <TuiFormGroupField header="Workflow"
                           description="Select existing workflow. If there is none create it on workflow page.">
            <div className="SearchInput">
                <TuiSelectFlow value={data?.flow}
                               errorMessage={getValueIfExists(errors, 'flow.name')}
                               onSetValue={value => setValue('flow', value)}
                               type="collection"
                />
            </div>
        </TuiFormGroupField>
    </TuiFormGroupContent>
}



function EventTriggerForm({
                              data: _data,
                              properties: _properties,
                              errors,
                              onChange
                          }) {

    const [data, setData] = useState(_data)
    const [properties, setProperties] = useState(_properties)

    function setConsents(value) {
        const d = {
            ...properties,
            consents: value
        }

        setProperties(d)
        if (onChange instanceof Function) {
            onChange({...data, properties: d})
        }
    }

    function setValue(key, value) {
        const d = {
            ...data,
            [key]: value
        }
        setData(d)
        if (onChange instanceof Function) {
            onChange({...d, properties})
        }
    }

    return <TuiFormGroupContent>
        <TuiFormGroupField header="Event type" description="Type event type to filter incoming events. If there
                are no events please start collecting data first.">
            <TuiSelectEventType initValue={data?.event_type?.id ? data?.event_type : {}}
                                errorMessage={getValueIfExists(errors, 'event_type.name')}
                                onSetValue={(value) => setValue('event_type', value)}
                                onlyValueWithOptions={false}/>
        </TuiFormGroupField>
        <TuiFormGroupField header="Source" description="Select event source. Event without selected source will be
                    discarded.">
            <TuiSelectEventSource value={data?.source}
                                  onSetValue={(value) => setValue('source', value)}
                                  errorMessage={getValueIfExists(errors, 'source.name')}/>
        </TuiFormGroupField>
        <TuiFormGroupField header="Workflow"
                           description="Select existing workflow. If there is none create it on workflow page.">
            <div className="SearchInput">
                <TuiSelectFlow value={data?.flow}
                               errorMessage={getValueIfExists(errors, 'flow.name')}
                               onSetValue={value => setValue('flow', value)}
                               type="collection"
                />
            </div>
        </TuiFormGroupField>
        <TuiFormGroupField header="Required consents"
                           description="Select consents that are required to route selected event type. Leave empty if none is required.">
            <TuiSelectMultiConsentType
                label="Required consents"
                value={properties?.consents || []}
                fullWidth={true}
                onSetValue={value => setConsents(value)}
            />
        </TuiFormGroupField>
    </TuiFormGroupContent>
}


export default function RuleForm({onSubmit, data: _data}) {

    const defaultData = {
        type: "event-collect",
        event_type: {},
        source: {},
        flow: {},
        properties: {},
        segment: {},
        name: "",
        description: "",
        tags: []
    }

    _data = {
        ...defaultData,
        ..._data
    }

    const [trigger, setTrigger] = useState(_data)
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState(null)
    const [responseError, setResponseError] = useState(null)

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleTypeChange = (value) => {
        setErrors(null)
        setResponseError(null)
        setTrigger({...trigger, type: value})
    }

    const handleSave = async (url, payload) => {
        try {
            setProcessing(true);
            const response = await asyncRemote({
                url: url,
                method: "post",
                data: payload
            })

            if (response.data && mounted.current && onSubmit instanceof Function) {
                onSubmit(response.data)
            }
        } catch (e) {
            if (e && mounted.current) {
                setResponseError(getError(e));
            }
        } finally {
            if(mounted.current) {
                setProcessing(false)
            }
        }
    }

    const handleSubmit = async () => {

        const entitySchema = getRequiredEntityNameSchema()
        const requiredString = getRequiredStringSchema()

        if(trigger.type === 'event-collect') {

            const schema = yup.object().shape({
                flow: entitySchema,
                event_type: entitySchema,
                source: entitySchema,
                type: requiredString,
            });

            const _errors = await validateYupSchema(schema, trigger)

            if (!isEmptyObjectOrNull(_errors)) {
                setErrors(_errors)
            } else {
                setErrors(null)

                const payload = {
                    type: trigger.type,
                    event_type: trigger.event_type,
                    source: (trigger?.source?.id) ? trigger.source : null,
                    flow: trigger.flow,
                    properties: trigger.properties || {},
                    name: trigger.name,
                    description: trigger.description,
                    tags: trigger.tags,
                    id: (!trigger?.id) ? uuid4() : trigger.id,

                    segment: {id: "", name: ""},
                };

                await handleSave('/rule', payload)

            }
        } else if (trigger.type === 'segment-add') {

            const schema = yup.object().shape({
                flow: entitySchema,
                segment: entitySchema,
                type: requiredString,
            });

            const _errors = await validateYupSchema(schema, trigger)

            if (!isEmptyObjectOrNull(_errors)) {
                setErrors(_errors)
            } else {
                setErrors(null)

                const payload = {
                    type: trigger.type,
                    segment: trigger.segment,
                    flow: trigger.flow,
                    name: trigger.name,
                    description: trigger.description,
                    tags: trigger.tags,
                    id: (!trigger?.id) ? uuid4() : trigger.id,

                    event_type:  {id: "", name: ""},
                    source:  {id: "", name: ""},
                    properties: {},
                };

                await handleSave('/rule', payload)

            }
        }




    }

    const handleDataChange = (value) => {
        setTrigger({...trigger, ...value})
    }

    return <TuiForm style={{margin: 20}}>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Trigger settings"/>
            {responseError && <ErrorsBox errorList={responseError} style={{borderRadius: 0}}/>}
            <TuiFormGroupContent>
                <TuiFormGroupField header="Trigger type" description="What should trigger the workflow.">
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={trigger?.type}
                        style={{width: 250}}
                        onChange={(ev) => handleTypeChange(ev.target.value)}
                    >
                        <MenuItem value="event-collect" selected>Collected Event</MenuItem>
                        {/*Disabled*/}
                        {/*<MenuItem value="segment-add"><span className="flexLine"><BsStar size={20} style={{marginRight: 5}}/> Added Segment</span></MenuItem>*/}
                    </TextField>
                </TuiFormGroupField>
            </TuiFormGroupContent>


        </TuiFormGroup>
        <TuiFormGroup>
            {trigger.type === "event-collect"
                ? <EventTriggerForm
                    data={{
                        flow: trigger?.flow,
                        event_type: trigger.event_type,
                        source: trigger.source
                    }}
                    properties={trigger?.properties || {}}
                    errors={errors}
                    onChange={handleDataChange}
                />
                : <SegmentTriggerForm
                    data={{flow: trigger?.flow || {}, segment: trigger?.segment || {}}}
                    errors={errors}
                    onChange={handleDataChange}
                />}
        </TuiFormGroup>
        <ShowHide label="Custom description" style={{marginBottom: 10}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Describe trigger"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Trigger name can be any string that
                    identifies the trigger.">
                        <TextField
                            label={"Trigger name"}
                            value={trigger?.name}
                            onChange={(ev) => {
                                setTrigger({...trigger, name: ev.target.value})
                            }}
                            size="small"
                            variant="outlined"
                            fullWidth
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description"
                                       description="Description will help you to understand when the trigger starts the workflow.">
                        <TextField
                            label={"Trigger description"}
                            value={trigger?.description}
                            multiline
                            rows={3}
                            onChange={(ev) => {
                                setTrigger({...trigger, description: ev.target.value})
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Trigger tags"
                                       description="Tag the rules type to group it into meaningful groups.">
                        <TuiTagger tags={trigger?.tags} onChange={value => setTrigger({...trigger, tags: value})}/>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </ShowHide>


        <Button label="Save" onClick={handleSubmit} style={{justifyContent: "center"}} progress={processing}
                error={responseError}/>
    </TuiForm>
}

RuleForm.propTypes = {onSubmit: PropTypes.func, data: PropTypes.object}

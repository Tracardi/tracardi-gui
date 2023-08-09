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

function SegmentTriggerForm({
                                data: _data,
                                properties: _properties,
                                flowErrorMessage,
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
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={data?.segment}
                onChange={(ev) => setValue('segment', ev.target.value)}
            />

        </TuiFormGroupField>
        <TuiFormGroupField header="Workflow"
                           description="Select existing workflow. If there is none create it on workflow page.">
            <div className="SearchInput">
                <TuiSelectFlow value={data?.flow}
                               errorMessage={flowErrorMessage}
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

    console.log("EventTriggerForm render", errors)
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
                value={properties?.consents}
                fullWidth={true}
                onSetValue={value => setConsents(value)}
            />
        </TuiFormGroupField>
    </TuiFormGroupContent>
}


export default function RuleForm({onSubmit, data: _data}) {



    const defaultData = {
        type: "event",
        event_type: {},
        source: {},
        flow: {},
        properties: [],
        segment: "",
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
    const [errors, setErrors] = useState({})
    const [responseError, setResponseError] = useState(null)

    console.log("RuleForm render", trigger)

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleTypeChange = (value) => {
        setTrigger({...trigger, type: value})
    }

    function convertErrorsToKeyValue(errorsArray) {
        const errorsObject = {};

        errorsArray.forEach(error => {
            const { field, message } = error;
            errorsObject[field] = message;
        });

        return errorsObject;
    }

    const handleSubmit = async () => {

        const entitySchema = yup.object().shape({
            name: yup.string().required('Can not be empty'),
        });

        const schema = yup.object().shape({
            flow: entitySchema,
            event_type: entitySchema,
            source: entitySchema,
            type: yup.string().required('Type is required'),
        });

        const _errors = await schema.validate(trigger, { abortEarly: false })
            .then(() => null)
            .catch(validationError => {
                const errors = validationError.inner.map(error => {
                    return {
                        field: error.path,
                        message: error.message,
                    };
                });

                return convertErrorsToKeyValue(errors)

            });

        if (!isEmptyObjectOrNull(_errors)) {
            setErrors(_errors)
        } else {
            setErrors({})

            const payload = {
                ...trigger,
                id: (!trigger?.id) ? uuid4() : trigger.id,
                source: (trigger?.source?.id) ? trigger.source : null,
            };

            console.log(payload)

            try {
                setProcessing(true);
                const response = await asyncRemote({
                    url: "/rule",
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


    }

    const handleEventTriggerChange = (value) => {
        setTrigger({...trigger, ...value})
    }

    return <TuiForm style={{margin: 20}}>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Trigger settings" description="Workflow engine will trigger selected flow
            only if incoming event type and resource are equal to the values set in this form. "/>
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
                        <MenuItem value={"event"} selected>Collected Event</MenuItem>
                        <MenuItem value={"segment-add"}>Added Segment</MenuItem>
                    </TextField>
                </TuiFormGroupField>
            </TuiFormGroupContent>
            {trigger.type == "event"
                ? <EventTriggerForm
                    data={{
                        flow: trigger?.flow,
                        event_type: trigger.event_type,
                        source: trigger.source
                    }}
                    properties={trigger?.properties || []}
                    errors={errors}
                    onChange={handleEventTriggerChange}
                />
                : <SegmentTriggerForm date={{
                    flow: trigger?.flow,
                    segment: trigger?.segment || ""
                }}
                                      errors={errors}
                                      segmentErrorMessage={""}
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

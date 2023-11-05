import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from "uuid";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {setMetrics, testProfileMetric} from "../../../remote_api/endpoints/metrics";
import * as yup from "yup";
import {getRequiredStringSchema, validateYupSchema} from "../../../misc/validators";
import {checkValueIfExists, getValueIfExists} from "../../../misc/values";
import {IntervalSelect} from "./IntervalsSelect";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import RefInput from "./inputs/RefInput";
import TimeTextField from "./inputs/TimeTextInput";
import {BsXCircle, BsCheckCircle} from "react-icons/bs";


export default function MetricForm({onSubmit, init}) {

    const defaultData = {
        id: uuid4(),
        timestamp: null,
        name: "",
        description: "",
        type: "metric",
        enabled: false,
        content: {
            metric: {
                aggregation: {
                    type: "count",
                    field: "type"
                },
                event: {
                    type: {
                        id: "",
                        name: ""
                    }
                },
                field: "",
                interval: 60*60*24  // 24h
            }
        },
        // This is indexed
        config: {
            metric: {
                span: 0,
                new: true
            }
        }
    }

    init = {
        ...defaultData,
        ...init
    }

    const [setting, setSetting] = useState(init)
    const [errors, setErrors] = useState({})
    const [processing, setProcessing] = useState(false)
    const [apiError, setApiError] = useState(false)
    const requiredString = getRequiredStringSchema()
    const [testError, setTestError] = useState({
        error: false
    })
    const [testOk, setTestOk] = useState(false)


    function setData(key, value, obj = null) {
        const props = key.split('.');
        const newObj = {...obj || setting};
        let currentObj = newObj;

        for (let i = 0; i < props.length - 1; i++) {
            const prop = props[i];
            if (!currentObj[prop] || typeof currentObj[prop] !== 'object') {
                currentObj[prop] = {};
            }
            currentObj = currentObj[prop];
        }

        const finalProp = props[props.length - 1];
        currentObj[finalProp] = value;

        setSetting(newObj);

        return newObj;
    }

    const handleTest = async () => {
        try {
            setTestOk(false)
            setTestError({error:false})
            const response = await asyncRemote(testProfileMetric({
                agg: setting.content.metric.aggregation.type,
                field: setting.content.metric.aggregation.field,
                event_type: setting.content.metric.event.type.id,
                span: setting.config.metric.span
            }))

            if (response.data) {
                if(response.data?.error === true) {
                    setTestError(response.data)
                } else {
                    setTestOk(true)
                }
            }
        } catch (e) {

        }
    }

    const handleSubmit = async () => {
        try {

            setApiError(false)
            setErrors(false)

            const validationSchema = yup.object().shape({
                name: requiredString
            });

            let _errors = await validateYupSchema(validationSchema, setting)

            if (_errors) {
                setErrors(_errors)
                setApiError(true)
            } else {
                setProcessing(true)

                setData("config.metric.new", true)

                const payload = setting;

                const response = await asyncRemote(
                    setMetrics(payload)
                )

                setProcessing(false)
                if (response) {
                    if (onSubmit instanceof Function) {
                        onSubmit(payload)
                    }
                }
            }

        } catch (e) {
            if (e) {
                setProcessing(false)
                setErrors({})
                setApiError(true);
            }
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Name"}
                        error={checkValueIfExists(errors, "name")}
                        helperText={getValueIfExists(errors, "name")}
                        value={setting.name}
                        onChange={(ev) => {
                            setData("name", ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you to understand how the metric is calculated.">
                    <TextField
                        label={"Description"}
                        value={setting.description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setData("description", ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Active" description="Enable/disable metric calculation.
                Disabled metric does not delete already calculated metrics.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={setting.enabled}
                            onChange={(ev) => setData("enabled", ev.target.checked)}
                        />
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Select Data for Metric Computation"/>

            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Please choose the event type for which you'd like
            to create a metric. If you want to aggregate values regardless of the event type, leave this field empty.">
                    <TuiSelectEventType
                        value={setting.content?.metric?.event?.type}
                        onSetValue={ (value) => {
                            setData("content.metric.event.type", value)
                        }}
                    />
                </TuiFormGroupField>

                <TuiFormGroupField header="Limit data" description="Type the time duration for which the
                metric will be computed. For instance, aggregate all purchases within a 30-day period. Leave this
                field empty if you don't wish to impose any data limitations.">
                    <div className="flexLine">Limit to data collected within: <TimeTextField value={setting.config?.metric?.span || 0} onChange={(v) => {
                        setData("config.metric.span", v)
                    }}/></div>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Define Metric Computation"/>

            <TuiFormGroupContent>
                <TuiFormGroupField header="Expected output of aggregation"
                                   description="What is the expected output of aggregation. e.g sum of purchased items, or count of event types">

                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        label="Aggregation type"
                        value={setting.content?.metric?.aggregation?.type}
                        style={{width: 250}}
                        onChange={(ev) => setData("content.metric.aggregation.type", ev.target.value)}
                    >
                        <MenuItem value="count" selected>Count</MenuItem>
                        <MenuItem value="sum">Sum</MenuItem>
                        <MenuItem value="avg">Average</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Which event field should be aggregated"
                description="CAUTION: When performing mathematical calculations such as SUM, AVERAGE, or any other computation,
                except for counting, the field must exclusively contain numeric values."
                >
                    <RefInput value={{value: setting.content.metric.aggregation.field}}
                              autocomplete="event"
                              fullWidth={true}
                              locked={true}
                              defaultType={true}
                              label="Event field"
                              onChange={(value) => setData("content.metric.aggregation.field", value.value)}
                              style={{width: "100%"}}/>
                </TuiFormGroupField>

                <TuiFormGroupField description="The system can assess whether the chosen field is suitable
                for the selected type of aggregation. To do so click button below."
                >
                    <Button label="Test Metric Computation"
                            icon={testError.error ? <BsXCircle size={20}/> : <BsCheckCircle size={20}/>}
                            error={testError.error || false}
                            confirmed={testOk}
                            onClick={handleTest}/>
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Define Metric Field"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Metric fields"
                                   description="Define where would you like to save the metric within the profile
                                   data schema. If left empty. The name will be created from the metric name.">
                    <TextField
                        label="Metric field name"
                        error={checkValueIfExists(errors, "content.metric.field")}
                        helperText={getValueIfExists(errors, "content.metric.field")}
                        value={setting.content?.metric?.field || ""}
                        onChange={(ev) => {
                            setData("content.metric.field", ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />

                </TuiFormGroupField>



            </TuiFormGroupContent>
        </TuiFormGroup>

        {setting.config?.metric?.span > 0 && <TuiFormGroup>
            <TuiFormGroupHeader header="Define Metric Updates"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="How often should the metric be updated?"
                                   description="Time-dependent metric should be updated regularly to
                                   ensure its accuracy. Specify how often you'd like to refresh this metric.">
                    <div className="flexLine">
                        <span style={{padding: "0 5px"}}>Every</span>
                        <IntervalSelect value={setting.content.metric.interval}
                                        onChange={ev => setData("content.metric.interval", ev.target.value)}/>
                    </div>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>}

        <Button label="Save" error={apiError} onClick={handleSubmit} progress={processing}
                style={{justifyContent: "center"}}/>
    </TuiForm>
}

MetricForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
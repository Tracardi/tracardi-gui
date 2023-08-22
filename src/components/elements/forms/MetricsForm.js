import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from "uuid";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {JsonEditorField} from "../editors/JsonEditor";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {setMetrics} from "../../../remote_api/endpoints/metrics";
import * as yup from "yup";
import {getRequiredStringSchema, validateYupSchema} from "../../../misc/validators";
import {getValueIfExists} from "../../../misc/values";
import {IntervalSelect} from "./IntervalsSelect";

export default function MetricForm({onSubmit, init}) {

    const schemes = {
        "event-aggregation-metric": {
            "time-change-trigger": {
                "event-type": "e.g. order-completed",
                "aggregation": "sum || count || average",
                "time": {
                    "span": "30",
                    "type": "minute || day || month"
                }
            },
            "data-change-trigger": {
                "event-type": "e.g. order-completed",
                "aggregation": "sum || count || average"
            },
        },
        "event-type-exists": {
            "time-change-trigger": {
                "event-type": "e.g. order-completed",
                "time": {
                    "span": "30",
                    "type": "minute || day || month"
                }
            },
            "data-change-trigger": {
                "event-type": "e.g. order-completed"
            }
        },
        "custom": {
            "time-change-trigger": {},
            "data-change-trigger": {}
        }
    }

    const helpers = {
        "event-aggregation-metric": "Aggregates values from defined events type for each profile. For example it can sum all the purchase order values for all profile [order completed] events.",
        "event-type-exists": "Checks weather the defined event type was collected for a profile.",
        "custom": "Custom definition of metric."
    }

    const defaultData = {
        id: uuid4(),
        timestamp: null,
        name: "",
        description: "",
        type: "metric",
        enabled: false,
        content: {
            metric: {
                type: "event-aggregation-metric",
                schema: "{}",
                interval: 1440
            }
        },
        // This is indexed
        config: {
            metric: {
                trigger: "data-change-trigger"
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

    // const setData = (key, value) => {
    //     setSetting({...setting, [key]: value})
    // }

    function setData(key, value, obj=null) {
        const props = key.split('.');
        const newObj = { ...obj || setting };
        let currentObj = newObj;

        for (let i = 0; i < props.length - 1; i++) {
            const prop = props[i];
            if (!currentObj[prop] || typeof currentObj[prop] !== 'object') {
                currentObj[prop] = {};
            }
            currentObj = currentObj[prop];
        }

        currentObj[props[props.length - 1]] = value;
        setSetting(newObj);

        return newObj
    }

    const handleSubmit = async () => {
        try {

            setApiError(false)
            setErrors(false)

            const validationSchema = yup.object().shape({
                name: requiredString
            });

            let _errors = await validateYupSchema(validationSchema, setting)

            // Check for JSON erros

            let schema;
            try {
                schema = JSON.parse(setting.content.metric.schema)
            } catch (e) {
                schema = null
            }

            if(schema === null) {
                _errors= {..._errors, "content.metric.schema": "Incorrect JSON"}
            }

            if(_errors) {
                setErrors(_errors)
                setApiError(true)
            } else {
                setProcessing(true)
                const payload = {
                    id: setting.id,
                    name: setting.name,
                    description: setting.description,
                    enabled: setting.enabled,
                    type: "metric",
                    content: setting.content,
                    config: setting.config
                };
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

    const handleMetricChange = (value) => {
        const s = setData("content.metric.type", value)
        setData("content.metric.schema", JSON.stringify(schemes[value][s.config.metric.trigger], null, " "), s)
    }

    const handleTriggerChange = (value) => {
        const s = setData("config.metric.trigger", value)
        setData("content.metric.schema", JSON.stringify(schemes[s.content.metric.type][value], null, " "), s)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Name"}
                        error={getValueIfExists(errors, "name", false)}
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
            <TuiFormGroupHeader header="Metric configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Metric type" description={helpers[setting.content.metric.type]}>
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        label="Metric type"
                        value={setting.content.metric.type}
                        style={{width: 250}}
                        onChange={(ev) => handleMetricChange(ev.target.value)}
                    >
                        <MenuItem value="event-aggregation-metric" selected>Event Aggregation Metric</MenuItem>
                        <MenuItem value="event-type-exists">Event Type Existence Metric</MenuItem>
                        <MenuItem value="custom">Custom Metric</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Trigger type" description="Please define a trigger type.
                If the metric depends on time select [time based trigger] if it depends on data change select [data change trigger].">
                    <div className="flexLine">
                        <TextField
                            select
                            variant="outlined"
                            size="small"
                            label="Trigger type"
                            value={setting.config.metric.trigger}
                            style={{width: 250}}
                            onChange={(ev) => handleTriggerChange(ev.target.value)}
                        >
                            <MenuItem value="time-change-trigger">Time Based Trigger</MenuItem>
                            <MenuItem value="data-change-trigger" selected>Data Based Trigger</MenuItem>
                        </TextField> {setting.config.metric.trigger === 'time-change-trigger' && <><span style={{padding: "0 5px"}}>Every</span> <IntervalSelect value={setting.content.metric.interval}/></>}
                    </div>

                </TuiFormGroupField>

                <TuiFormGroupField header="Configuration schema" description="Fill configuration schema">
                        <JsonEditorField
                            label="Configuration Schema"
                            value={setting.content.metric.schema}
                                         onChange={(value) => setData("content.metric.schema", value)}
                                         autocomplete={true}
                                         errorMessage={getValueIfExists(errors, "content.metric.schema")}
                        />
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        <Button label="Save" error={apiError} onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

MetricForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
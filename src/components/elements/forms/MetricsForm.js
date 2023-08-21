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

export default function MetricForm({onSubmit, init}) {

    const defaultData = {
        id: uuid4(),
        timestamp: null,
        name: "",
        description: "",
        type: "",
        enabled: false,
        content: {}
    }

    init = {
        ...defaultData,
        ...init
    }

    const [setting, setSetting] = useState(init)
    const [errors, setErrors] = useState({})

    const setData = (key, value) => {
        setSetting({...setting, [key]: value})
    }

    const handleSubmit = async () => {
        try {
            let content;
            try {
                content = JSON.parse(setting.content)
            } catch (e) {
                content = null
            }

            const requiredString = getRequiredStringSchema()

            const schema = yup.object().shape({
                name: requiredString,
                type: requiredString,
            });

            let _errors = await validateYupSchema(schema, setting)
            if(content === null) {
                _errors= {..._errors, content: "Incorrect JSON"}
            }
            if(_errors) {
                setErrors(_errors)
            } else {
                const payload = {
                    id: setting.id,
                    name: setting.name,
                    description: setting.description,
                    type: "metric",
                    content: {
                        type: setting.type,
                        config: content
                    }
                };
                const response = await asyncRemote(
                    setMetrics(payload)
                )
                if (response) {
                    if (onSubmit instanceof Function) {
                        onSubmit(payload)
                    }
                }
            }

        } catch (e) {
            // if (e) {
            //     if (mounted.current) setError(getError(e));
            // }
        } finally {
            // if (mounted.current) setProcessing(false);
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Name"}
                        error={getValueIfExists(errors, "name")}
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
                <TuiFormGroupField header="Metric type">
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        label="Metric type"
                        value={setting.type}
                        error={getValueIfExists(errors, "type")}
                        helperText={getValueIfExists(errors, "type")}
                        style={{width: 250}}
                        onChange={(ev) => setData("type", ev.target.value)}
                    >
                        <MenuItem value="event-aggregation-metric" selected>Event Aggregation Metric</MenuItem>
                        <MenuItem value="event-type-exists">Event Type Existence Metric</MenuItem>
                        <MenuItem value="custom">Custom Metric</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Configuration schema" description="Fill configuration schema">
                        <JsonEditorField
                            label="Configuration Schema"
                            value={setting.content}
                                         onChange={(value) => setData("content", value)}
                                         autocomplete={true}
                                         errorMessage={getValueIfExists(errors, "content")}
                        />
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>

        <Button label="Save" error={false} onClick={handleSubmit} progress={false} style={{justifyContent: "center"}}/>
    </TuiForm>
}

MetricForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
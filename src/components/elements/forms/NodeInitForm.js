import {JsonForm} from "./JsonForm";
import React, {useEffect, useState} from "react";
import FormSchema from "../../../domain/formSchema";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import ConfigEditor from "../../flow/editors/ConfigEditor";
import {getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import NotImplemented from "../misc/NotImplemented";
import Switch from "@mui/material/Switch";

export function NodeInitJsonForm({pluginId, formSchema, init, manual, onSubmit}) {

    const [data, setData] = useState(init)
    const [formErrorMessages, setFormErrorMessages] = useState({});
    const [saveOk, setSaveOk] = useState(false);

    useEffect(() => {
        // Reset to default values
        setData(init);
        setSaveOk(false);
        setFormErrorMessages({})
    }, [init])

    const handleValidationData = (result) => {
        if (result.status === true) {

            if (formErrorMessages !== {}) {
                setFormErrorMessages({})
            }

            setData(result.data)  // result.data is validated config
            onSubmit(result.data)
            setSaveOk(true);

        } else {
            if (result.data !== null) {
                setFormErrorMessages(result.data);
                setSaveOk(false);
            }
        }
    }

    const handleSubmit = (config) => {
        const form = new FormSchema(formSchema)
        form.validate(pluginId, config).then(handleValidationData)
    }

    return <ConfigEditor
        config={data}
        manual={manual}
        onConfig={handleSubmit}
        confirmed={saveOk}
        errorMessages={formErrorMessages}
    />
}

export function NodeRuntimeConfigForm({pluginId, value: initValue, onChange}) {

    const [value, setValue] = useState(initValue || {
        skip: false,
        block_flow: false,
        on_connection_error_repeat: "0",
        on_connection_continue: false,
        run_in_background: false,
        join_input_payload: false,
        append_input_payload: false,
    })

    useEffect(() => {
        // Reset to default values
        setValue({...initValue});
    }, [initValue])

    const handleChange = (field, fieldValue) => {
        const newValue = {...value, [field]: fieldValue}
        setValue(newValue)
        if(onChange) {
            onChange(pluginId, newValue)
        }
    }

    return <TuiForm>
        <NotImplemented>This form is not implemented yet</NotImplemented>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Advanced Runtime Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Skip this node at runtime" description="This will make the workflow skip this action
                and copy its input payload to all all output ports. This will trigger all output ports. This feature may
                be useful if you want to disable certain function, but do not want to remove it from the workflow.">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value?.skip}
                                onChange={(ev) => {handleChange("skip", ev.target.checked)}}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Skip this node at runtime and pass the data"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Block flow on this node" description="This will make the workflow stop
                the branch that this action is in and no next action will be triggered. This feature may be useful if
                you want to part of the workflow, but do not want to remove nodes from from it.">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value?.block_flow}
                                onChange={(ev) => {handleChange("block_flow", ev.target.checked)}}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Block flow on this node"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Run in background" description="Run this action in background and do not wait for the output.">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value?.run_in_background}
                                onChange={(ev) => handleChange("run_in_background", ev.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Run in background"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Join output data" description="This will make the action wait until all the input data is delivered and it will trigger output only once with all the output data merged.">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value?.join_input_payload}
                                onChange={(ev) => {handleChange("join_input_payload", ev.target.checked)}}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Join output data"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Append input to output" description="This will append input payload to the output. If there is a conflict in data some data may be overridden.">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value?.append_input_payload}
                                onChange={(ev) => {handleChange("append_input_payload", ev.target.checked)}}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Append input payload to output result"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Error handling"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Number of repeats on connection error" description="If there is a connection error how many times repeat the action.">
                        <TextField variant="outlined"
                                   label="Number of repeats"
                                   value={value?.on_connection_error_repeat}
                                   onChange={(ev) => {handleChange("on_connection_error_repeat", parseInt(ev.target.value) || 0)}}
                                   size="small"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Continue on error" description="If there would you like the flow to continue if possible.">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={value?.on_error_continue}
                                    onChange={(ev) => {handleChange("on_error_continue", ev.target.checked)}}
                                    name="enable"
                                    color="primary"
                                />
                            }
                            label="Continue workflow even when there is an error"
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
    </TuiForm>
}

export function NodeInitForm({pluginId, init, formSchema, onSubmit}) {

    const [data, setData] = useState({...init})
    const [formErrorMessages, setFormErrorMessages] = useState({});
    const [saveOK, setSaveOk] = useState(false);
    const [serverSideError, setServerSideError] = useState(null)

    useEffect(() => {
        // Reset to default values
        setData({...init});
        setSaveOk(false);
        setFormErrorMessages({})
    }, [init])

    const handleValidationData = (result) => {
        if (result?.status === true) {

            if (formErrorMessages !== {}) {
                setFormErrorMessages({})
            }

            setData(result?.data)  // result.data is validated config
            onSubmit(result?.data)
            setSaveOk(true);
            setServerSideError(null)

        } else {
            if (result?.data !== null) {
                setSaveOk(false);
                if(result?.error && result?.error?.response?.status === 422) {
                    setFormErrorMessages(result?.data);
                    setServerSideError(null)
                } else {
                    setFormErrorMessages({});
                    setServerSideError(getError(result?.error))
                }
            }
        }
    }

    const handleFormSubmit = () => {
        const form = new FormSchema(formSchema)
        form.validate(pluginId, data).then(handleValidationData)
    }

    const handleFormChange = (value) => {
        setData(MutableMergeRecursive(data, value))
    }

    return <JsonForm
        pluginId={pluginId}
        values={data}
        errorMessages={formErrorMessages}
        serverSideError={serverSideError}
        schema={formSchema}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        confirmed={saveOK}
    />
}
import React, {useEffect, useRef, useState} from "react";
import FormSchema from "../../../domain/formSchema";
import ConfigEditor from "../../flow/editors/ConfigEditor";
import {getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import NotImplemented from "../misc/NotImplemented";
import Switch from "@mui/material/Switch";
import {MenuItem} from "@mui/material";
import JsonForm from "./JsonForm";
import {isEmptyObject} from "../../../misc/typeChecking";
import useAfterMountEffect from "../../../effects/AfterMountEffect";

export function NodeInitJsonForm({pluginId, formSchema, microservice, init, manual, onSubmit}) {

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
        form.validate(pluginId, microservice, config).then(handleValidationData)
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

    let value = (initValue || {
        skip: false,
        block_flow: false,
        on_connection_error_repeat: "0",
        on_error_continue: false,
        run_in_background: false,
        join_input_payload: false,
        append_input_payload: false,
        run_once: {
            enabled: false,
            value: null,
            ttl: 0,
            type: "value"
        }
    })

    const handleChange = (field, fieldValue) => {
        value = {...value, [field]: fieldValue}
        if (onChange) {
            onChange(pluginId, value)
        }
    }

    const Select = ({value, onChange, label, children}) => {

        const [selectValue, setSelectValue] = useState(value || "value");

        const handleChange = (ev) => {
            setSelectValue(ev.target.value);
            onChange(ev.target.value)
        }

        return <TextField variant="outlined"
                          label={label}
                          value={selectValue}
                          onChange={handleChange}
                          select
                          size="small"
                          style={{width: 150, marginRight: 5}}
        >
            {children}
        </TextField>
    }

    const TurnOnOff = ({value, label, onChange}) => {

        const [toggleValue, setToggleValue] = useState(value);

        const handleChange = (ev) => {
            setToggleValue(ev.target.checked)
            onChange(ev.target.checked)
        }

        return <FormControlLabel
            control={
                <Switch
                    checked={toggleValue}
                    onChange={handleChange}
                    name="enable"
                    color="primary"
                />
            }
            label={label}
        />
    }

    const Input = ({value, label, onChange}) => {

        const [valueToMonitor, setValueToMonitor] = useState(value);

        return <TextField variant="outlined"
                          label={label}
                          value={valueToMonitor}
                          onChange={(ev) => {
                              setValueToMonitor(ev.target.value)
                              onChange(ev.target.value)
                          }}
                          fullWidth
                          size="small"
        />
    }

    return <TuiForm>
        <NotImplemented>Not all features are not fully implemented yet</NotImplemented>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Advanced Runtime Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Skip this node at runtime" description="This will make the workflow skip this action
                and copy its input payload to all all output ports. This will trigger all output ports. This feature may
                be useful if you want to disable certain function, but do not want to remove it from the workflow.">
                    <TurnOnOff label="Skip this node at runtime and pass the data"
                               onChange={(value) => handleChange("skip", value)}
                               value={value?.skip}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Stop flow on this node" description="This will make the workflow stop
                the branch that this action is in and no next action will be triggered. This feature may be useful if
                you want to part of the workflow, but do not want to remove nodes from from it.">
                    <TurnOnOff label="Block flow on this node"
                               onChange={(value) => {
                                   handleChange("block_flow", value)
                               }}
                               value={value?.block_flow}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Conditional workflow stop" description="Set when the workflow should be stopped. With this
                setting you can make the workflow stop at this node and then wait for a defined value or condition to change.
                This is useful if you have a set of actions that sends a message to customer, but you would like
                to send only one message within a given time span or when a certain condition is met, eg. customer is within a walking
                distance to your facility.">
                    <TurnOnOff label="Stop workflow on this node if value did not change"
                               onChange={(v) => {
                                   value.run_once.enabled = v
                                   if (onChange) {
                                       onChange(pluginId, value)
                                   }
                               }}
                               value={value?.run_once?.enabled || false}/>
                    <fieldset>
                        <legend>Conditional running settings</legend>
                        <p>What trigger value should be monitored for changes. Value also can be a condition.
                        </p>
                        <div style={{display: "flex"}}>
                            <Select
                                label="type"
                                value={value?.run_once?.type}
                                onChange={(v) => {
                                    value.run_once.type = v
                                    if (onChange) {
                                        onChange(pluginId, value)
                                    }
                                }}
                            >
                                <MenuItem value="value">Value</MenuItem>
                                <MenuItem value="condition">Condition</MenuItem>
                            </Select>
                            <Input label="Value to monitor"
                                   value={value?.run_once?.value}
                                   onChange={(v) => {
                                       value.run_once.value = v
                                       if (onChange) {
                                           onChange(pluginId, value)
                                       }
                                   }}
                            />
                        </div>

                        <p>How many seconds the trigger value should be consider unchanged. Sometimes it may be suitable
                            to
                            refresh after certain amount of time. This way value will not become stale. Change of value
                            triggers the execution of the action.
                        </p>
                        <Input label="Time to  live"
                               value={value?.run_once?.ttl}
                               onChange={(v) => {
                                   value.run_once.ttl = v
                                   if (onChange) {
                                       onChange(pluginId, value)
                                   }
                               }}
                        />
                    </fieldset>
                </TuiFormGroupField>
                <TuiFormGroupField header="Run in background"
                                   description="Run this action in background and do not wait for the output.">
                    <TurnOnOff label="Run in background"
                               value={value?.run_in_background}
                               onChange={(value) => handleChange("run_in_background", value)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Join output data"
                                   description="This will make the action wait until all the input data is delivered and it will trigger output only once with all the output data merged.">
                    <TurnOnOff label="Join output data"
                               value={value?.join_input_payload}
                               onChange={(value) => {
                                   handleChange("join_input_payload", value)
                               }}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Append input to output"
                                   description="This will append input payload to the output. If there is a conflict in data some data may be overridden.">
                    <TurnOnOff label="Append input payload to output result"
                               value={value?.append_input_payload}
                               onChange={(value) => {
                                   handleChange("append_input_payload", value)
                               }}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Error handling"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Number of repeats on connection error"
                                   description="If there is a connection error how many times repeat the action.">
                    <TextField variant="outlined"
                               label="Number of repeats"
                               value={value?.on_connection_error_repeat}
                               onChange={(ev) => {
                                   handleChange("on_connection_error_repeat", parseInt(ev.target.value) || 0)
                               }}
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Continue on error"
                                   description="If there would you like the flow to continue if possible.">
                    <TurnOnOff label="Continue workflow even when there is an error"
                               value={value?.on_error_continue}
                               onChange={(value) => {
                                   handleChange("on_error_continue", value)
                               }}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export const NodeInitForm = ({nodeId, pluginId, microservice, init, formSchema, onSubmit}) => {

    const initFormErrors =  useRef({})

    const [formErrorMessages, setFormErrorMessages] = useState(initFormErrors.current);
    const [saveOK, setSaveOk] = useState(false);
    const [serverSideError, setServerSideError] = useState(null)

    // tego uzywam aby zresetowac stan gdy mamy dwa takie same nody i klikamy pomiędzy nimi.
    useAfterMountEffect(() => {
        // Reset to default values if node changes
        setSaveOk(false);
        // ustawiam formErrorMessages z referencji bo wstawienie nowego obiektu {} powoduje zmiane stanu i rerender
        setFormErrorMessages(initFormErrors.current);
        setServerSideError(null);
    }, [nodeId])

    const handleValidationData = (result) => {
        if (result?.status === true) {

            if (!isEmptyObject(formErrorMessages)) {
                setFormErrorMessages({})
            }

            onSubmit(result?.data)
            setSaveOk(true);
            setServerSideError(null)

        } else {
            if (result?.data !== null) {
                setSaveOk(false);
                if (result?.error && result?.error?.response?.status === 422) {
                    setFormErrorMessages(result?.data);
                    setServerSideError(null);
                } else {
                    setFormErrorMessages({});
                    setServerSideError(getError(result?.error))
                }
            }
        }
    }

    const handleFormSubmit = (values) => {
        const form = new FormSchema(formSchema)
        form.validate(pluginId, microservice, values).then(handleValidationData)
    }

    const handleFormChange = (values) => {
        // This does not rerender component
        init = values
    }

    return <JsonForm
        values={init}
        errorMessages={formErrorMessages}
        serverSideError={serverSideError}
        schema={formSchema}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        confirmed={saveOK}
    />
}

function areEqual(prevProps, nextProps) {
    return prevProps.nodeId===nextProps.nodeId;
}
export const MemoNodeInitForm = React.memo(NodeInitForm, areEqual);
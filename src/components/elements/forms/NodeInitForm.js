import {JsonForm} from "./JsonForm";
import React, {useEffect, useState} from "react";
import FormSchema from "../../../domain/formSchema";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import ConfigEditor from "../../flow/editors/ConfigEditor";
import {getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@material-ui/core/TextField";
import {CheckBox} from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Warning from "../misc/Warning";
import Button from "./Button";
import NotImplemented from "../misc/NotImplemented";

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

export function NodeMetaForm({pluginId, init, onSubmit}) {
    return <TuiForm>
        <NotImplemented>This form is not implemented yet</NotImplemented>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Action Runtime Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Number of repeats on error" description="If there is an error how many times repeat the action.">
                    <TextField variant="outlined"
                               label="Number of repeats"
                               value="0"
                               onChange={(ev) => {
                               }}
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Continue on error" description="If there would you like the flow to continue if possible.">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={false}
                                onChange={() => {
                                }}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Continue workflow on this action error"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Run in background" description="Run this action in background and do not wait for the output.">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => {
                                }}
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
                            <Checkbox
                                checked={false}
                                onChange={() => {
                                }}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Join output data"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Append result to output" description="This will append each result to the output.">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={false}
                                onChange={() => {
                                }}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Append result to output"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={()=>{}} progress={false} style={{justifyContent: "center"}}/>
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
import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import {v4 as uuid4} from "uuid";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiSelectFlow from "../tui/TuiSelectFlow";
import ErrorsBox from "../../errors/ErrorsBox";

export default function LiveSegmentForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: (!init?.id) ? uuid4() : init.id,
            name: "",
            description: "",
            enabled: false,
            workflow: {
                id: "",
                name: ""
            }
        }
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [enabled, setEnabled] = useState(init.enabled);
    const [processing, setProcessing] = useState(false);
    const [workflow, setWorkflow] = useState(init.workflow);

    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [workflowErrorMessage, setWorkflowErrorMessage] = useState(null);
    const [error, setError] = useState(null);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {

        if (!name || name.length === 0 || !workflow?.id || workflow?.id === "") {
            if (!name || name.length === 0) {
                setNameErrorMessage("Segment name can not be empty");
            } else {
                setNameErrorMessage(null);
            }

            if (!workflow?.id || workflow?.id === "") {
                setWorkflowErrorMessage("Please select workflow. It can not be empty");
            } else {
                setWorkflowErrorMessage(null);
            }

            return;
        }

        const payload = {
            id: (!init?.id) ? uuid4() : init.id,
            name: name,
            description: description,
            workflow:workflow,
            enabled: enabled,
        }

            try {
                setProcessing(true);
                setError(null);
                const response = await asyncRemote(
                    {
                        url: '/segment/live',
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
            <TuiFormGroupHeader header="Describe live segment"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Live segment name"}
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
                                   description="Description will help you to understand when the live segmentation is applied.">
                    <TextField
                        label={"Live segment description"}
                        value={description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setDescription(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Live Segmentation Logic"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Segmentation workflow" description="Select segmentation workflow.
                Segmentation workflows define the logic of segmentation.">
                    <TuiSelectFlow value={workflow}
                                   onSetValue={setWorkflow}
                                   errorMessage={workflowErrorMessage}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Activation" description="Set if this segment is active. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabled}
                            onChange={() => setEnabled(!enabled)}
                            name="enabledSegment"
                        />
                        <span>Enable/Disable segment</span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

LiveSegmentForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
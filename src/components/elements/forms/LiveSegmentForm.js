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
import MenuItem from "@mui/material/MenuItem";
import AlertBox from "../../errors/AlertBox";
import NoData from "../misc/NoData";
import KqlAutoComplete from "./KqlAutoComplete";


function ConditionSegmentationJob({init, onChange}) {

    const [data, setData] = useState({ segment: init.segment, condition: init.condition});

    const handleChange = (key, value) => {
        const newValue = {
            ...data,
            [key]: value
        }
        setData(newValue)
        if(onChange instanceof  Function) {
            onChange(newValue)
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Conditional Segmentation Job"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Segment"
                                   description="Please enter the name of the segment where the profile should be added when the condition is met.">
                    <TextField
                        label="Segment name"
                        value={data.segment}
                        onChange={(ev) => {
                            handleChange("segment", ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Condition"
                                   description="What condition needs to be met in order to add a profile to the segment?">
                    <KqlAutoComplete index="profile"
                                     value={data.condition}
                                     onChange={(value) => handleChange("condition", value)}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

    </TuiForm>
}

function WorkflowSegmentationJob({init, onChange}) {

    const [workflow, setWorkflow] = useState(init.workflow);

    const handleWorkflowChange = (value) => {
        setWorkflow(value);
        onChange({
            type: 'workflow',
            workflow: value
        })
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Segmentation Workflow Job"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Segmentation workflow" description="Select segmentation workflow.
                Segmentation workflows define the logic of segmentation.">
                    <TuiSelectFlow value={workflow}
                                   onSetValue={handleWorkflowChange}
                                   type="segmentation"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

    </TuiForm>
}


export default function LiveSegmentForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: (!init?.id) ? uuid4() : init.id,
            name: "",
            description: "",
            enabled: false,
            type: "workflow",
            condition: null,
            operation: null,
            segment: null,
            code: null,
            workflow: {
                id: "",
                name: ""
            }
        }
    }

    const [data, setData] = useState(init);
    const [processing, setProcessing] = useState(false);

    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [buttonError, setButtonError] = useState(false);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {

        if (!data.name || data.name.length === 0) {
            setNameErrorMessage("Segmentation name can not be empty");
            setButtonError(true)
            return
        } else {
            setNameErrorMessage(null);
            setButtonError(false);
        }

        if(data.type === 'workflow') {
            if (!data.workflow.id || data.workflow.name.length === 0) {
                setAlert("Workflow name can not be empty. Please select workflow name.");
                setButtonError(true)
                return
            } else {
                setAlert(null);
                setButtonError(false);
            }
        }

        const payload = {
            ...data,
            id: (!init?.id) ? uuid4() : init.id,
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

    const handleChange = (values) => {
        setData({...data, ...values})
    }

    return <>
        <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Describe Segment"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Segment name"}
                        error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                        helperText={nameErrorMessage}
                        value={data.name}
                        onChange={(ev) => {
                            setData({...data, name: ev.target.value})
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you to understand when the segmentation is applied.">
                    <TextField
                        label={"Segment description"}
                        value={data.description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setData({...data, description: ev.target.value})
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Segmentation Type"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Segmentation type"
                                   description="Select segmentation type that you would like to perform.">
                    <TextField
                        style={{width: 300}}
                        select
                        size="small"
                        variant="outlined"
                        label='Type'
                        value={data.type}
                        onChange={(e) => setData({...data, type: e.target.value})}
                    >
                        <MenuItem value="workflow">Segmentation by Workflow</MenuItem>
                        <MenuItem value="condition">Segmentation by Condition</MenuItem>
                        <MenuItem value="code">Segmentation by Code</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Activation" description="Set if this segment is active. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={data.enabled}
                            onChange={() => setData({...data, enabled: !data.enabled})}
                            name="enabledSegment"
                        />
                        <span>Enable/Disable segment</span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

    </TuiForm>
        {data.type === 'workflow' && <WorkflowSegmentationJob init={init} onChange={handleChange}/>}
        {data.type === 'condition' && <ConditionSegmentationJob init={init} onChange={handleChange}/>}
        {data.type === 'code' && <NoData header="Not implemented"/>}
        {error && <ErrorsBox errorList={error}/>}
        {alert && <AlertBox>{alert}</AlertBox>}
        <div className="Box10">
            <Button label="Save" onClick={handleSubmit}
                    progress={processing}
                    error={buttonError}
                    style={{justifyContent: "center"}}/>
        </div>

    </>
}

LiveSegmentForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
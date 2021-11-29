import React, {useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {v4 as uuid4} from "uuid";
import {request} from "../../../remote_api/uql_api_endpoint";
import {remote} from "../../../remote_api/entrypoint";
import PropTypes from 'prop-types';
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiFormError from "../tui/TuiFormError";

export default function SegmentForm({onSubmit, init}) {

    if (!init) {
        init = {
            id: (!init?.id) ? uuid4() : init.id,
            eventType: "",
            condition: "",
            name: "",
            description: "",
            enabled: false
        }
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [condition, setCondition] = useState(init.condition);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [conditionErrorMessage, setConditionErrorMessage] = useState(null);
    const [enabled, setEnabled] = useState(init.enabled);
    const [processing, setProcessing] = useState(false);
    const [type, setType] = useState(init.eventType);

    const onTqlValidate = async () => {
        try {
            const response = await remote({
                    url: '/tql/validate',
                    method: 'post',
                    data: condition
                }
            );
            if (response) {
                setConditionErrorMessage(null)
            }
            return true;
        } catch (e) {
            setConditionErrorMessage("Could not parse condition.")
            return false;
        }

    }

    const handleSubmit = async () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage(null);
            }
            if (!condition || condition.length === 0) {
                setConditionErrorMessage("Condition can not be empty");
            } else {
                setConditionErrorMessage(null);
            }
            return;
        }

        if (!await onTqlValidate()) {
            return;
        }

        const payload = {
            id: (!init?.id) ? uuid4() : init.id,
            name: name,
            description: description,
            eventType: type.id,
            condition: condition,
            enabled: enabled,
        }

        setProcessing(true);
        request({
                url: '/segment',
                method: 'post',
                data: payload
            },
            setProcessing,
            (e) => {
                if (e) {
                    setErrorMessage(e[0].msg);
                }
            },
            (response) => {
                if (response !== false) {
                    request({
                            url: '/segments/refresh'
                        },
                        setProcessing,
                        () => {
                        },
                        () => {
                            if (onSubmit) {
                                onSubmit(payload)
                            }
                        }
                    )
                }
            }
        )
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Segmentation"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Bind this segment event type. You can select
                None then segment will be checked at every event. against all events.">
                    <TuiSelectEventType value={{name: type, id: type}} onSetValue={setType}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Condition" description="Segments are created after the event is processed.
                    Then Profile properties are evaluated against the condition you type below.
                    If profile meets the requirements then it will be assigned to the segment. ">
                    <TextField
                        label={"Set segment condition"}
                        value={condition}
                        multiline
                        rows={3}
                        error={(typeof conditionErrorMessage !== "undefined" && conditionErrorMessage !== '' && conditionErrorMessage !== null)}
                        helperText={conditionErrorMessage ? conditionErrorMessage : "Condition example: profile@stats.visits>10 AND profile@traits.public.boughtProducts>1"}
                        onChange={(ev) => {
                            setCondition(ev.target.value)
                        }}
                        onBlurCapture={onTqlValidate}
                        variant="outlined"
                        fullWidth
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
        <TuiFormGroup>
            <TuiFormGroupHeader header="Describe segment"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="he segment name will be its id, after spaces are
                replaced with dashes and letters lowercased">
                    <TextField
                        label={"Segment name"}
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
                                   description="Description will help you to understand when the segment condition is applied.">
                    <TextField
                        label={"Segment description"}
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
        {errorMessage && <TuiFormError message={errorMessage}/>}
        <Button label="Save" onClick={handleSubmit} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

SegmentForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
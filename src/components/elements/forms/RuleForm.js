import React, {useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import {v4 as uuid4} from 'uuid';
import PropTypes from 'prop-types';
import TuiSelectFlow from "../tui/TuiSelectFlow";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {request} from "../../../remote_api/uql_api_endpoint";
import TuiFormError from "../tui/TuiFormError";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";

export default function RuleForm({onReady, init}) {

    if (!init) {
        init = {
            flow: {},
            event: {},
            name: "",
            description: "",
            source: {},
            sourceDisabled: true
        }

    }

    const [flow, setFlow] = useState(init.flow);
    const [type, setType] = useState(init.event);
    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [source, setSource] = useState(init.source);
    const [errorMessage, setErrorMessage] = useState("");
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [flowErrorMessage, setFlowErrorMessage] = useState("");
    const [sourceErrorMessage, setSourceErrorMessage] = useState("");
    const [sourceDisabled, setSourceDisabled] = useState(init.sourceDisabled);


    const handleType = (value) => {
        setType(value);
        if (value) {
            setSourceDisabled(false);
        } else {
            setSourceDisabled(true);
        }
    }

    const handleSourceSet = (value) => {
        setSource(value);
    }

    const handleFlowChange = (value) => {
        setFlow(value)
    }

    const handleSubmit = () => {
        console.log(source, isEmptyObjectOrNull(source))

        if (isEmptyObjectOrNull(type) || isEmptyObjectOrNull(source) || isEmptyObjectOrNull(flow) || !name) {

            if (isEmptyObjectOrNull(source)) {
                setSourceErrorMessage("Resource can not be empty");
            } else {
                setSourceErrorMessage("")
            }

            if (!name || name.length === 0) {
                setNameErrorMessage("Rule name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if (isEmptyObjectOrNull(type)) {
                setTypeErrorMessage("Event type can not be empty");
            } else {
                setTypeErrorMessage("");
            }

            if (isEmptyObjectOrNull(flow)) {
                setFlowErrorMessage("Flow name can not be empty");
            } else {
                setFlowErrorMessage("");
            }

            return;
        }

        const payload = {
            id: (!init?.id) ? uuid4() : init.id,
            name: name,
            event: {type: type.name},
            source: (source?.id) ? source : null,
            description: description,
            flow: flow
        };

        request({
                url: "/rule",
                method: "post",
                data: payload
            },
            () => { },
            (e)=>{
                if(e) {
                    setErrorMessage(e[0].msg);
                }
            },
            (data) => {
                if(data) {
                    onReady(data)
                }
            }
        )
    }

    return <TuiForm style={{margin:20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Rule trigger and workflow" description="Workflow engine will trigger given flow
            only if incoming event type and resource are equal to the values set in this form. "/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Type event type to filter incoming events. If there
                are no events please start collecting data first.">
                    <TuiSelectEventType value={type} errorMessage={typeErrorMessage} onSetValue={handleType}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Resource" description="Select event resource. Event without selected resource will be
                    discarded.">
                    <TuiSelectEventSource value={source}
                                          disabled={sourceDisabled}
                                          onSetValue={handleSourceSet}
                                          errorMessage={sourceErrorMessage}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Workflow"
                                   description="Select existing workflow. If there is none create it on workflow page.">
                    <div className="SearchInput">
                        <TuiSelectFlow value={flow} errorMessage={flowErrorMessage} onSetValue={handleFlowChange}/>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Describe rule"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Rule name can be any string that
                    identifies rule.">
                    <TextField
                        label={"Rule name"}
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
                                   description="Description will help you to understand when the rule triggers the flow.">
                    <TextField
                        label={"Rule description"}
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
        {errorMessage && <TuiFormError message={errorMessage} />}
        <Button label="Save" onClick={handleSubmit} style={{justifyContent: "center"}}/>
    </TuiForm>
}

RuleForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}

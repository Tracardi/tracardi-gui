import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from 'uuid';
import PropTypes from 'prop-types';
import TuiSelectFlow from "../tui/TuiSelectFlow";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import TuiTagger from "../tui/TuiTagger";
import ErrorsBox from "../../errors/ErrorsBox";

export default function RuleForm({onSubmit, data}) {

    if (!data) {
        data = {
            source: {},
            event: {},
            flow: {},
            name: "",
            description: "",
            tags: []
        }
    }

    const [flow, setFlow] = useState(data?.flow || {});
    const [type, setType] = useState(data?.event?.type ? {name: data.event.type, id: data.event.type} : {});
    const [name, setName] = useState(data?.name || "");
    const [description, setDescription] = useState(data.description);
    const [source, setSource] = useState(data.source);
    const [error, setError] = useState(null);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [flowErrorMessage, setFlowErrorMessage] = useState("");
    const [sourceErrorMessage, setSourceErrorMessage] = useState("");
    const [processing, setProcessing] = useState(false);
    const [tags, setTags] = useState(data?.tags || []);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleType = (value) => {
        setType(value);
    }

    const handleSourceSet = (value) => {
        setSource(value);
    }

    const handleFlowChange = (value) => {
        setFlow(value)
    }

    const handleSubmit = async () => {
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
            id: (!data?.id) ? uuid4() : data.id,
            name: name,
            event: {type: type.name},
            source: (source?.id) ? source : null,
            description: description,
            flow: flow,
            tags: tags
        };

        try {
            setProcessing(true);
            const response = await asyncRemote({
                url: "/rule",
                method: "post",
                data: payload
            })

            if (response.data && mounted.current && onSubmit instanceof Function) {
                onSubmit(response.data)
            }
        } catch (e) {
            if (e && mounted.current) {
                setError(getError(e));
            }
        } finally {
            if(mounted.current) {
                setProcessing(false)
            }
        }
    }

    return <TuiForm style={{margin: 20}}>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Routing rule settings" description="Workflow engine will trigger selected flow
            only if incoming event type and resource are equal to the values set in this form. "/>
            {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event type" description="Type event type to filter incoming events. If there
                are no events please start collecting data first.">
                    <TuiSelectEventType initValue={type} errorMessage={typeErrorMessage} onSetValue={handleType} onlyValueWithOptions={false}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Source" description="Select event source. Event without selected source will be
                    discarded.">
                    <TuiSelectEventSource value={source}
                                          onSetValue={handleSourceSet}
                                          errorMessage={sourceErrorMessage}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Workflow"
                                   description="Select existing workflow. If there is none create it on workflow page.">
                    <div className="SearchInput">
                        <TuiSelectFlow value={flow}
                                       errorMessage={flowErrorMessage}
                                       onSetValue={handleFlowChange}
                                       type="collection"
                        />
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
                <TuiFormGroupField header="Rule tags"
                                   description="Tag the rules type to group it into meaningful groups.">
                    <TuiTagger tags={tags} onChange={setTags}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        <Button label="Save" onClick={handleSubmit} style={{justifyContent: "center"}} progress={processing} error={error !== null}/>
    </TuiForm>
}

RuleForm.propTypes = {onSubmit: PropTypes.func, data: PropTypes.object}

import React, {useState} from "react";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import {v4 as uuid4} from 'uuid';
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import FormDescription from "../misc/FormDescription";
import Columns from "../misc/Columns";
import Rows from "../misc/Rows";
import Form from "../misc/Form";
import FormHeader from "../misc/FormHeader";

export default function RuleForm({onSubmit, init}) {

    if(!init) {
        init = {
            flow: {id: "", name: "" },
            event: {name: ""},
            name: "",
            description: "",
            source: {id: "", name: "" },
            sourceDisabled: true
        }

    }

    const [flow, setFlow] = useState(init.flow);
    const [type, _setType] = useState(init.event);
    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [source, _setSource] = useState(init.source);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [flowErrorMessage, setFlowErrorMessage] = useState("");
    const [sourceDisabled, setSourceDisabled] = useState(init.sourceDisabled);

    const setType = (value) => {
        _setType(value);
        if(value) {
            setSourceDisabled(false);
        } else {
            setSourceDisabled(true);
        }
    }

    const setSource = (value) =>{
        _setSource(value);
    }

    const _onSubmit = () => {

        if(!flow || !type || !name) {
            console.log(!flow || !type || !name)
            if(!name || name.length === 0) {
                setNameErrorMessage("Rule name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if(!type || type.length === 0) {
                setTypeErrorMessage("Event type can not be empty");
            } else {
                setTypeErrorMessage("");
            }

            if(!flow || flow.length === 0) {
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

        onSubmit(payload)
    }

    return <Form>
            <Columns>
                <FormHeader>Set up trigger and flow</FormHeader>
                <ElevatedBox>
                    <FormDescription>Workflow engine will trigger given flow only if incoming event type and
                        optionally source are equal to the values set in this form. </FormDescription>

                    <FormSubHeader>Event type</FormSubHeader>
                    <FormDescription>Type event type to filter incoming events.</FormDescription>
                    <AutoComplete
                        disabled={false}
                        error={typeErrorMessage}
                        placeholder="Event type"
                        url="/events/metadata/type"
                        initValue={type}
                        onSetValue={setType} onDataLoaded={
                            (result) => {
                                return result.data?.result.map((key) => {return {name: key, id: key}});
                            }
                        }/>
                    <FormSubHeader>Source <sup style={{fontSize: "70%"}}>* optional</sup></FormSubHeader>
                    <FormDescription>Type source or leave it blank if this trigger refers to all sources. Source can be set only if event type is set. </FormDescription>
                    <AutoComplete disabled={sourceDisabled}
                                  solo={false}
                                  placeholder="Source"
                                  url="/sources"
                                  initValue={source}
                                  onSetValue={setSource}
                                  onDataLoaded={
                                    (result) => {
                                        if(result) {
                                            let sources = []
                                            for (const source of result?.data?.result) {
                                                if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                                    sources.push({name: source.name, id: source.id})
                                                }
                                            }
                                            return sources
                                        }
                                    }
                    }/>

                    <FormSubHeader>Flow name</FormSubHeader>
                    <FormDescription>Select existing flow name or type new flow name. Later on find your flow by this name and set-up flow graph.</FormDescription>
                    <div className="SearchInput">
                        <AutoComplete
                            disabled={false}
                            placeholder="Flow name"
                            url="/flows"
                            error={flowErrorMessage}
                            initValue={flow}
                            onSetValue={setFlow} onDataLoaded={
                            (result) => {
                                if(result) {
                                    let flows = []
                                    for (const flow of result?.data?.result) {
                                        if (typeof flow.name !== "undefined" && typeof flow.id !== "undefined") {
                                            flows.push({name: flow.name, id: flow.id})
                                        }
                                    }
                                    return flows
                                }
                            }
                        }/>
                    </div>
                </ElevatedBox>

                <FormHeader>Describe rule</FormHeader>
                <ElevatedBox>
                    <FormSubHeader>Name</FormSubHeader>
                    <FormDescription>Rule name can be any string that
                        identifies rule.
                    </FormDescription>
                    <TextField
                        label={"Rule name"}
                        error={nameErrorMessage}
                        helperText={nameErrorMessage}
                        value={name}
                        onChange={(ev) => {setName(ev.target.value) }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />

                    <FormSubHeader>Description <sup style={{fontSize: "70%"}}>* optional</sup></FormSubHeader>
                    <FormDescription>Description will help you to understand when the rule triggers the flow.
                    </FormDescription>
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

                </ElevatedBox>
            </Columns>
            <Rows style={{paddingLeft: 30}}>
                <Button label="Save" onClick={_onSubmit}/>
            </Rows>

    </Form>
}

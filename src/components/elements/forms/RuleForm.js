import React, {useState} from "react";
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
import PropTypes from 'prop-types';
import TuiSelectResource from "../tui/TuiSelectResource";
import TuiSelectFlow from "../tui/TuiSelectFlow";
import TuiSelectEventType from "../tui/TuiSelectEventType";

export default function RuleForm({onSubmit, init}) {

    if (!init) {
        init = {
            flow: {id: "", name: ""},
            event: {name: ""},
            name: "",
            description: "",
            source: {id: "", name: ""},
            sourceDisabled: true
        }

    }

    const [flow, setFlow] = useState(init.flow);
    const [type, _setType] = useState(init.event);
    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [source, setSource] = useState(init.source);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [flowErrorMessage, setFlowErrorMessage] = useState("");
    const [sourceErrorMessage, setSourceErrorMessage] = useState("");
    const [sourceDisabled, setSourceDisabled] = useState(init.sourceDisabled);

    const setType = (value) => {
        _setType(value);
        if (value) {
            setSourceDisabled(false);
        } else {
            setSourceDisabled(true);
        }
    }

    const handleSourceSet = (value) => {
        console.log('set-source', value)
        setSource(value);
    }

    const handleFlowChange = (value) => {
        console.log(value)
        setFlow(value)
    }

    const _onSubmit = () => {

        if (!flow || !type || !name || !source || source?.id === "" || flow?.id === '' || type?.name === '') {

            if (source === null || source?.id === "") {
                setSourceErrorMessage("Resource can not be empty");
            } else {
                setSourceErrorMessage("")
            }

            if (!name || name.length === 0) {
                setNameErrorMessage("Rule name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if (!type || type.length === 0 || type?.name === '') {
                setTypeErrorMessage("Event type can not be empty");
            } else {
                setTypeErrorMessage("");
            }

            if (!flow || flow.length === 0 || flow?.id === '') {
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
                <TuiSelectEventType value={type} errorMessage={typeErrorMessage} onSetValue={setType}/>

                <FormSubHeader>Resource</FormSubHeader>
                <FormDescription>Select event resource. Event without selected resource will be
                    discarded.</FormDescription>
                <TuiSelectResource value={source} disabled={sourceDisabled} onSetValue={handleSourceSet}
                                   errorMessage={sourceErrorMessage}/>

                <FormSubHeader>Flow name</FormSubHeader>
                <FormDescription>Select existing flow. If there is none create it on Flow page.</FormDescription>
                <div className="SearchInput">
                    <TuiSelectFlow value={flow} errorMessage={flowErrorMessage} onSetValue={handleFlowChange}/>
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

RuleForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}

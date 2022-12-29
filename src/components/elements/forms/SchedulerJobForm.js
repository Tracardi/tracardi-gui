import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import TrackerPayloadFormGroup from "./TrackerPayloadFormGroup";

export default function SchedulerJobForm({onSubmit, init: value}) {

    if (!value) {
        value = {
            name: "",
            description: "",
            time: "",
            tracker_payload: {
                source: {
                    id: null,
                },
                session: {
                    id: null
                },
                metadata: {
                    time: {
                        insert: "2022-12-29T14:22:11.001Z"
                    },
                    ip: "string",
                    status: "string"
                },
                profile: {
                    id: "string"
                },
                context: {},
                properties: {},
                request: {},
                events: [],
                options: {},
                profile_less: false
            }
        }
    }

    const [data, setData] = useState(value);
    const [name, setName] = useState(value.name);
    const [description, setDescription] = useState(value.description);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {

    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label={"Name"}
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
                                   description="Description will help you to understand when the event validation is applied.">
                    <TextField
                        label={"Description"}
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
                <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                    <TuiTagger tags={[]}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Cron like trigger">
                    <TextField
                        label="Cron"
                        value={data.time}
                        onChange={(ev) => {
                            setData({...data, time: ev.target.value})
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TrackerPayloadFormGroup value={data.tracker_payload}/>
        <Button label="Save" onClick={handleSubmit} style={{justifyContent: "center"}}/>
    </TuiForm>
}

SchedulerJobForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
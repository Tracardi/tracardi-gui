import React, {useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import TrackerPayloadForm from "./TrackerPayloadForm";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";

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
                session: null,
                profile: null,
                context: {},
                properties: {},
                events: [],
                options: {},
                profile_less: false
            }
        }
    }

    const [data, setData] = useState(value);
    const [progress, setProgress] = useState(false);
    const [error, setError] = useState(null);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSubmit = async () => {
        try {
            setError(false)
            setProgress(true)
            const response = await asyncRemote({
                url: "/scheduler/job",
                method: "POST",
                data: data
            })
            if(onSubmit instanceof Function) {
                onSubmit()
            }
        } catch (e) {
            if(mounted.current) setError(getError(e))
        } finally {
            if(mounted.current) setProgress(false)
        }
    }


    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name">
                        <TextField
                            label={"Name"}
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
                                       description="Description will help you to understand when the event validation is applied.">
                        <TextField
                            label={"Description"}
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
                    <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                        <TuiTagger tags={[]}/>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Time trigger"/>
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
        </TuiForm>
        <div style={{margin: 20}}>
            <TrackerPayloadForm
                value={data.tracker_payload}
                profileLess={true}
                onChange={(value) => { setData({...data, tracker_payload: value})}}/>

            {error && <ErrorsBox errorList={error} />}

            <Button label="Save"
                    progress={progress}
                    error={error}
                    onClick={handleSubmit}
                    style={{justifyContent: "center"}}/>
        </div>

    </>

}

SchedulerJobForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}
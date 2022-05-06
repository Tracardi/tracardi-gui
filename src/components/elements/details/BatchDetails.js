import React from "react";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent, TuiFormGroupField } from "../tui/TuiForm";
import { TextField, Autocomplete } from "@mui/material";
import ErrorsBox from "../../errors/ErrorsBox";
import BoolInput from "../forms/BoolInput";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import JsonForm from "../forms/JsonForm";
import Button from "../forms/Button";

export default function BatchDetails ({ onClose, id }) {

    const [error, setError] = React.useState(null);
    const [batch, setBatch] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);
    const [runProgress, setRunProgress] = React.useState(false);
    const [debugRunProgress, setDebugRunProgress] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        if (mounted.current) setLoading(true);
        asyncRemote({url: "/batch/" + id})
        .then(response => {if (mounted.current) setBatch(response.data)})
        .catch(e => {if (mounted.current) setError(getError(e))})
        .finally(() => {if (mounted.current) setLoading(false)})
        return () => mounted.current = false;
    }, [id])

    const handleDelete = () => {
        if (mounted.current) setError(null);
        if (mounted.current) setDeleteProgress(true);
        asyncRemote({url: "/batch/" + id, method: "DELETE"})
        .then(onClose)
        .catch(e => {if (mounted.current) setError(getError(e)); })
        .finally(() => {if (mounted.current) setDeleteProgress(false)})
    }

    const handleRun = (debug) => {
        if (mounted.current) setError(null);
        if (mounted.current) {
            if (debug) {
                setRunProgress(true);
            } else {
                setDebugRunProgress(true);
            }
        };
        asyncRemote({url: "/batch/run/" + id + "?debug=" + debug, method: "POST"})
        .catch(e => {
            if (mounted.current) setError(getError(e))
        })
        .finally(() => {if (mounted.current) {
            if (debug) {
                setRunProgress(false);
            } else {
                setDebugRunProgress(false);
            }
        }})
    }

    return <>
        {loading && <CenteredCircularProgress />}
        {batch && 
            <TuiForm style={{margin: 20}}>
                <TuiFormGroup>
                    <TuiFormGroupHeader header={`${batch.name} batch`} description="Here you can inspect, delete, edit and run your batch."/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField header="Delete batch" description="After clicking this button, selected batch will be permanently deleted.">
                            <Button label="Delete" onClick={handleDelete} progress={deleteProgress}/>
                        </TuiFormGroupField>
                        <TuiFormGroupField header="Run batch" description="After clicking this button, batch will fetch data from selected resource and insert them to Tracardi
                                as events with fetched data as event properties.">
                            <Button label={batch.enabled ? "RUN" : "Batch disabled"} onClick={() => handleRun(false)} progress={runProgress} disabled={!batch.enabled}/>
                        </TuiFormGroupField>
                        <TuiFormGroupField header="Debug batch" description="After clicking this button, batch will fetch data from selected resource using test credentials, and 
                                insert them to Tracardi as events with fetched data as event properties.">
                            <Button label={batch.enabled ? "RUN DEBUG" : "Batch disabled"} onClick={() => handleRun(true)} progress={debugRunProgress} disabled={!batch.enabled}/>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
        }
        {error && <ErrorsBox errorList={error}/>}
    </>
}
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import Button from "./Button";
import {saveWorkflowInGitHub} from "../../../remote_api/endpoints/github";
import {useRequest} from "../../../remote_api/requestClient";
import {submit} from "../../../remote_api/submit";
import FetchError from "../../errors/FetchError";

export default function CommitFrom({value, onClose}) {

    const [metadata, setMetaData] = useState(value)
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState({})

    const [error, setError] = useState("")

    const [progress, setProgress] = useState(false)

    const {request} = useRequest()

    function sanitizeString(str) {
        return str
            // Remove all non-alphanumeric characters except spaces
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .trim()
            // Replace spaces with hyphens
            .replace(/\s+/g, '-')
            // Convert to lowercase
            .toLowerCase();
    }

    const getFileName = () => {

        if(metadata?.file_name) {
            return metadata?.file_name
        }

        if(metadata?.name) {
            return "workflows/" + sanitizeString(metadata.name) + ".tracardi"
        }

        return "workflows/please-type-name.tracardi"
    }

    const handleChange = (k, v) => {
        setMetaData({...metadata, [k]: v})
    }

    const handleSubmit = async () => {
        setProgress(true)
        const response = await submit(request, saveWorkflowInGitHub(metadata?.id, getFileName(), message))
        if (response?.status === 422) {
            setErrors(response.errors)
        } else if(response?.status === 200) {
            setErrors({})
            if (onClose instanceof Function) {
                setProgress(false)
                onClose()
            }
        } else {
            setProgress(false)
            setError(response)
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Commit to GitHub"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="File Name">
                    <TextField
                        label="File Name"
                        error={errors && "body.file_name" in errors}
                        helperText={errors && errors["body.file_name"] || ""}
                        value={getFileName()}
                        onChange={(ev) => {
                            handleChange("file_name", ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Message<sup>(Optional)</sup></span>}
                                   description={`Commit description will help you to understand what have been changed in this commit.`}>
                    <TextField
                        label={"Message"}
                        value={message}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setMessage(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <FetchError error={error} />}
            <Button label="Submit" progress={progress} onClick={handleSubmit}/>
        </TuiForm>
}
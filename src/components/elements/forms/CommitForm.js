import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import Button from "./Button";
import {loadGitHubFile, saveWorkflowInGitHub} from "../../../remote_api/endpoints/github";
import {useRequest} from "../../../remote_api/requestClient";
import {submit} from "../../../remote_api/submit";
import FetchError from "../../errors/FetchError";
import Tabs, {TabCase} from "../tabs/Tabs";
import GitHubFileList from "../lists/GitHubFileList";


function SubmitButton({label, closeLabel="Close", errorLabel="Error", progress, onClose, onSubmit}) {

    const [confirmation, setConfirmation] = useState(null)

    const handleSubmit = () => {
        console.log(typeof onSubmit)
        if(typeof onSubmit  === 'function') {
            Promise.resolve(onSubmit())
                .then(result => {
                    // Handle the result here
                    setConfirmation(result)
                })
                .catch(error => {
                    // Handle any errors here
                    setConfirmation(false)
                });
        }
    }

    if(confirmation === null) {
        return <Button label={label} progress={progress} onClick={handleSubmit}/>
    }

    if(confirmation) {
        return <Button label={closeLabel} onClick={onClose} selected={true}/>
    }
    // Error
    return  <Button label={errorLabel} onClick={onClose} error={true}/>

}

export default function CommitFrom({value, onClose, onLoad}) {

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
            return false
        } else if(response?.status === 200) {
            setErrors({})
            setProgress(false)
            return true
        } else {
            setProgress(false)
            setError(response)
            return false
        }
    }

    const handleSelect = async (row) => {
        try {
            const response = await request(loadGitHubFile(row.path))
            if(onLoad instanceof Function) {
                onLoad(response.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return <Tabs tabs={["Push", "Pull"]}>
        <TabCase id={0}>
            <TuiForm style={{margin: 20, width: 500}}>
                <TuiFormGroup>
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
                <SubmitButton
                    label="Submit"
                    closeLabel="Data Pushed - Close"
                    progress={progress}
                    onSubmit={handleSubmit}
                    onClose={onClose}/>
            </TuiForm>
        </TabCase>
        <TabCase id={1}>
            <TuiForm style={{margin: 20, width: 500}}>
                <TuiFormGroup style={{padding: 20, maxHeight: 320, overflowY: "auto"}}>
                    <GitHubFileList onSelect={handleSelect}/>
                </TuiFormGroup>
            </TuiForm>
        </TabCase>
    </Tabs>
}
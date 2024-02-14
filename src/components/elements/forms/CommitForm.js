import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import Button from "./Button";

export default function CommitFrom({value, onSubmit, errors}) {

    const [data, setData] = useState(value || {
        "file_name": "",
        "message": ""
    })

    const handleChange = (k, v) => {
        setData({...data, [k]: v})
    }

    const handleSubmit = () => {
        if (onSubmit instanceof Function) {
            onSubmit(data)
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
                        value={data?.file_name || ""}
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
                        value={data?.massage || ""}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            handleChange("massage", ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
            <Button label="Submit" onClick={handleSubmit}/>
        </TuiForm>
}
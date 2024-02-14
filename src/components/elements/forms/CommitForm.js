import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import React from "react";

export default function CommitFrom({value, onChange, errors}) {
    const handleChange = (k, v) => {
        if(onChange instanceof Function) {
            onChange({...value, [k]: v})
        }
    }
    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="File Name">
                    <TextField
                        label="File Name"
                        error={"body.file_name" in errors}
                        helperText={errors["body.file_name"] || ""}
                        value={value?.file_name || ""}
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
                        value={value?.massage || ""}
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
    </TuiForm>
}
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import ShowHide from "../misc/ShowHide";
import TuiTagger from "../tui/TuiTagger";
import React from "react";

export default function MetaDataFrom({name, value, onChange, errors}) {

    const handleChange = (v) => {
        if(onChange instanceof Function) {
            onChange(v)
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label="Name"
                        error={errors && "body.name" in errors}
                        helperText={(errors && errors["body.name"]) || ""}
                        value={value?.name || ""}
                        onChange={(ev) => {
                            handleChange({name: ev.target.value})
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>}
                                   description={`Description will help you to understand when the ${name} is used.`}>
                    <TextField
                        label={"Description"}
                        value={value?.description || ""}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            handleChange({description: ev.target.value})
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Active" description={`Enable/disable ${name}.`}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={value?.enabled || false}
                            onChange={(ev) => handleChange({enabled: ev.target.checked})}
                        />
                    </div>
                </TuiFormGroupField>

                <ShowHide label="Tags">
                    <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                        <TuiTagger tags={value?.tags} onChange={v=> handleChange({tags: v})}/>
                    </TuiFormGroupField>
                </ShowHide>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}
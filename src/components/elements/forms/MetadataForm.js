import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import ShowHide from "../misc/ShowHide";
import TuiTagger from "../tui/TuiTagger";
import React from "react";
import {useObjectState} from "../../../misc/useSyncState";

export default function MetaDataFrom({name, value, onChange, errors}) {

    const {get, update} = useObjectState({
        name: "meta",
        value,
        onChange
    })

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label="Name"
                        error={errors && "body.name" in errors}
                        helperText={(errors && errors["body.name"]) || ""}
                        value={get()?.name || ""}
                        onChange={(ev) => {
                            update({name: ev.target.value})
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
                        value={get()?.description || ""}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            update({description: ev.target.value})
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Active" description={`Enable/disable ${name}.`}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={get()?.enabled || false}
                            onChange={(ev) => update({enabled: ev.target.checked})}
                        />
                    </div>
                </TuiFormGroupField>

                <ShowHide label="Tags">
                    <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                        <TuiTagger tags={get()?.tags} onChange={v=> update({tags: v})}/>
                    </TuiFormGroupField>
                </ShowHide>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}
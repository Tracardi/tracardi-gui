import React, {memo, useState} from "react";
import ListOfForms from "./ListOfForms";
import AudienceFilteringForm from "./AudienceFilteringForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import ShowHide from "../misc/ShowHide";
import TuiTagger from "../tui/TuiTagger";
import KqlAutoComplete from "./KqlAutoComplete";
import {external} from "../misc/linking";
import Button from "./Button";

const ListOfAggregations = memo(function ({value, onChange}) {
    return <ListOfForms form={AudienceFilteringForm}
                        value={value}
                        defaultFormValue={{
                            entity: {
                                type: "event",
                                event_type: {id: "", name: ""},
                                where: ""
                            },
                            group_by: [],
                            group_where: ""
                        }}
                        onChange={onChange}
                        initEmpty={true}
                        align="bottom"/>
})

export default function AudienceForm({audienceId, onComplete}) {

    const [metadata, setMetaData] = useState({
        name: "",
        description: "",
        enabled: true,
        tags: []
    })

    const [join, setJoin] = useState([{
        entity: null,
        group_by: [],
        group_where: ""
    }])

    const handleMetaChange = (k, v) => {
        const _value = {...metadata, [k]: v}
        setMetaData(_value)
    }

    const handleQueryChange = (v) => {
        setJoin(v)
    }

    const handleSubmit = () => {
        console.log(
            {
                metadata: metadata,
                join: join
            }
        )
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name">
                    <TextField
                        label="Name"
                        // error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                        // helperText={nameErrorMessage}
                        value={metadata?.name || ""}
                        onChange={(ev) => {
                            handleMetaChange("name", ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>}
                                   description="Description will help you to understand when the event reshaping is applied.">
                    <TextField
                        label={"Description"}
                        value={metadata?.description || ""}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            handleMetaChange("description", ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Active" description="Enable/disable reshaping.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={metadata?.enabled}
                            onChange={(ev) => handleMetaChange("enabled", ev.target.checked)}
                        />
                    </div>
                </TuiFormGroupField>

                <ShowHide label="Tags">
                    <TuiFormGroupField header="Tags" description="Tags help with data organisation.">
                        <TuiTagger tags={metadata?.tags} onChange={v=> handleMetaChange("tags", v)}/>
                    </TuiFormGroupField>
                </ShowHide>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Audience selection"
                description="Please define how to filter out the audience from your database."
            />
            <TuiFormGroupContent>
                <KqlAutoComplete index="profile" label="Filter by profile attributes"/>
                <div style={{fontSize: 12}}>Do not know how to filter. Click <span
                    style={{textDecoration: "underline", cursor: "pointer"}}
                    onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.
                </div>
            </TuiFormGroupContent>
            <TuiFormGroupContent description="Add required events" style={{paddingTop:0}}>
                <fieldset>
                    <legend>Profiles must have</legend>
                    <ListOfAggregations
                        value={join}
                        onChange={handleQueryChange}/>
                </fieldset>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit}/>
    </TuiForm>
}
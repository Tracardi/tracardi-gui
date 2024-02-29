import {FieldBox} from "./FieldBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import ListOfForms from "./ListOfForms";
import AggregationForm from "./AggregationForm";
import React, {memo} from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import KqlAutoComplete from "./KqlAutoComplete";
import useTheme from "@mui/material/styles/useTheme";


function EntitySelect({value, onChange}) {

    const handleChange = (ev) => {
        if (onChange instanceof Function) {
            onChange(ev.target.value)
        }
    }

    return <TextField
        select
        variant="outlined"
        size="small"
        value={value || "event"}
        style={{width: 100}}
        onChange={handleChange}
    >
        <MenuItem value={"event"} selected>EVENT</MenuItem>
    </TextField>
}

export default function AudienceFilteringForm({value, onChange, errors}) {
    /*
    value = {
        entity: {
            type: "event"
            event_type: "",
            where: ""
        },
        group_by:[
            {
                aggr: "sum",
                by_field: {value: "", ref: true},
                save_as: ""
             }
        ],
        group_where: ""
    }
     */
    console.log("AudienceFilteringForm rr")
    const theme = useTheme();

    const handleChange = (k, v) => {
        value = {...value, [k]: v}
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    const handleEntityChange = (k, v) => {
        value.entity = {...value.entity, [k]: v}
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    return <fieldset
        style={{
            borderWidth: "2px 0 0",
            border: `2px solid ${theme.palette.common.black}`,
            borderRadius: 6,
            marginLeft: 5,
            marginBottom: 30
        }}>
        <legend>
            <EntitySelect value={value?.entity?.type || "event"} onChange={v => handleEntityChange("type", v)}/>
        </legend>
        <div className="flexLine">

            <FieldBox>
                <TuiSelectEventType
                    value={value.entity?.event_type}
                    onSetValue={(v) => handleEntityChange("event_type", v)}
                />
            </FieldBox>
            <KqlAutoComplete value={value.entity?.where}
                             index={value?.entity?.type}
                             label="Meets condition"
                             fullWidth={false}
                             width={565}
                             onChange={(v) => handleEntityChange("where", v)}
            />
        </div>

        <fieldset>
            <legend>And WHERE</legend>
            <div style={{marginLeft: 10}}>
                <ListOfForms
                    value={value?.group_by}
                    onChange={(v) => handleChange("group_by", v)}
                    form={AggregationForm}
                    defaultFormValue={{
                        aggr: "sum",
                        by_field: {value: "", ref: true},
                        save_as: ""
                    }}
                    width="auto"
                    justify="start"
                    align="right"
                    errors={errors}
                />
            </div>

            <div style={{marginTop: 20}}>
                <TextField
                    value={value?.group_where || ""}
                    onChange={(v) => handleChange("group_where", v.target.value)}
                    label="Meets Aggregation Condition"
                    fullWidth/>
            </div>
        </fieldset>

    </fieldset>

}
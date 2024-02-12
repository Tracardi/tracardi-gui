import {FieldBox} from "./FieldBox";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import TimeTextInput from "./inputs/TimeTextInput";
import ListOfForms from "./ListOfForms";
import AggregationForm from "./AggregationForm";
import React, {useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


function BooleanSelect({value, onChange}) {

    const handleChange = (ev) => {
        if(onChange instanceof Function) {
            onChange(ev.target.value)
        }
    }

    return  <TextField
        select
        variant="outlined"
        size="small"
        value={value || "event"}
        style={{width: 130}}
        onChange={handleChange}
    >
        <MenuItem value={"event"} selected>has EVENT</MenuItem>
        <MenuItem value={"entity"}>has ENTITY</MenuItem>
    </TextField>
}

function FilterEvents({value: _value, onChange}) {
    const [value, setValue] = useState(_value || {
        type: "and",
        event_type: "",
        sec: 0,
    })

    const handleChange = (field, newValue) => {
        const _value = {...value, [field]: newValue}
        setValue(_value)
        if (onChange instanceof Function) {
            onChange(_value)
        }
    }

    return <fieldset style={{borderWidth: "2px 0 0", borderTop: "2px solid white", borderRadius: 0, marginLeft: 5, marginTop: 30}}>
        <legend>
           <BooleanSelect value={value?.type || "and"} onChange={v => handleChange("type", v)}/>
        </legend>
        <div className="flexLine">

        <FieldBox>
            <TuiSelectEventType
                value={value.event_type}
                onSetValue={(v) => handleChange("event_type", v)}
            />
        </FieldBox> within
        last <TimeTextInput onChange={(v) => handleChange("sec", v)}
                            value={value.sec} label="Time"/>
    </div></fieldset>
}

export default function AudienceFilteringForm({value: _value, onChange}) {

    const handelChange = (k, v) => {
        _value[k] = v
        if(onChange instanceof Function) {
            onChange(_value)
        }
    }

    return <>
        <FilterEvents
            value={_value?.filter}
            onChange={(v) => handelChange("filter", v)}
        />
        <fieldset>
            <legend>WHERE</legend>
            <div style={{marginLeft: 10}}>
                <ListOfForms
                    value={_value?.aggregations}
                    onChange={(v) => handelChange("aggregations", v)}
                    form={AggregationForm}
                    defaultFormValue={{
                        aggr: "sum",
                        field: {value: "", ref: true},
                        field_value: ""
                    }}
                    width="auto"
                    justify="start"
                />
            </div>


        </fieldset>
        <div style={{marginTop:20}}>
            <TextField label="MEETS CONDITION" fullWidth/>
        </div>

    </>
}
import {FieldBox} from "./FieldBox";
import RefInput from "./inputs/RefInput";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import Tag from "../misc/Tag";

function AggregationOperation({value, label, onChange}) {

    const handleChange = (ev) => {
        if(onChange instanceof Function) {
            onChange(ev.target.value)
        }
    }

    return  <TextField
        select
        variant="outlined"
        size="small"
        label={label || "Aggregation"}
        value={value || "sum"}
        style={{width: 180}}
        onChange={handleChange}
    >
        <MenuItem value={"sum"} selected>Sum of</MenuItem>
        <MenuItem value={"avg"}>Average of</MenuItem>
        <MenuItem value={"max"}>Maximum value of</MenuItem>
        <MenuItem value={"min"}>Minimum value of</MenuItem>
    </TextField>
}

function ComparisonOperation({value, label, onChange}) {

    const handleChange = (ev) => {
        if(onChange instanceof Function) {
            onChange(ev.target.value)
        }
    }

    return  <TextField
        select
        variant="outlined"
        size="small"
        label={label || "Operation"}
        value={value || "="}
        style={{width: 200}}
        onChange={handleChange}
    >
        <MenuItem value={"="} selected>Is Equal</MenuItem>
        <MenuItem value={">"}>Is Bigger Then</MenuItem>
        <MenuItem value={">="}> Is Equal or Bigger Then</MenuItem>
        <MenuItem value={"<"}>Is Less Then</MenuItem>
        <MenuItem value={"<"}>Is Equal or Less Then</MenuItem>
        <MenuItem value={"!="}>Is Not Equal</MenuItem>
    </TextField>
}

export default function AggregationForm({value: _value, onChange}) {

    console.log("rerender", _value)

    const [value, setValue] = useState(_value || {
        aggr: "sum",
        field: {value:"", ref: true},
        field_value: ""
    })

    const handleChange = (field, newValue) =>{
        const _value = {...value, [field]: newValue}
        setValue(_value)
        if(onChange instanceof Function){
            onChange(_value)
        }
    }

    return <div className="flexLine">
        <AggregationOperation value={value.aggr} onChange={(v) => handleChange("aggr", v)}/>
        <span style={{marginLeft: 10}}>
            <RefInput
                fullWidth={true}
                autocomplete="event"
                locked={true}
                value={value.field}
                defaultType={true}
                label="Event data"
                onChange={(v) => handleChange("field", v)}
                width={"250px"}
            />
        </span>
        <Tag style={{margin: 10}}>as</Tag>
            <TextField size="small"
                       variant="outlined"
                       label="Value"
                       value={value.field_value || ""}
                       onChange={(ev) => handleChange("field_value", ev.target.value)}
                       style={{width: 300}}
            />
    </div>
}
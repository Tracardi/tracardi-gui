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
        style={{width: 130}}
        onChange={handleChange}
    >
        <MenuItem value={"value_count"}>Count of</MenuItem>
        <MenuItem value={"sum"} selected>Sum of</MenuItem>
        <MenuItem value={"avg"}>Average of</MenuItem>
        <MenuItem value={"max"}>Maximum of</MenuItem>
        <MenuItem value={"min"}>Minimum of</MenuItem>
    </TextField>
}

export default function AggregationForm({value: _value, onChange}) {

    const [value, setValue] = useState(_value || {
        aggr: "sum",
        by_field: {value:"", ref: true},
        save_as: ""
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
                value={value.by_field}
                defaultType={true}
                label="Event data"
                onChange={(v) => handleChange("by_field", v)}
                width={"250px"}
            />
        </span>
        <Tag style={{margin: 10}}>as</Tag>
            <TextField size="small"
                       variant="outlined"
                       label="Value"
                       value={value.save_as || ""}
                       onChange={(ev) => handleChange("save_as", ev.target.value)}
                       style={{width: 180}}
            />
    </div>
}
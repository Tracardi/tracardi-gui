import RefInput from "./inputs/RefInput";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import Tag from "../misc/Tag";
import {useObjectState} from "../../../misc/useSyncState";

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
        <MenuItem value={"median"}>Median of</MenuItem>
        {/*<MenuItem value={"cardinality"}>Cardinality of</MenuItem>*/}
    </TextField>
}

export default function AggregationForm({value: _value, onChange}) {

    const [disabled, setDisabled] = useState(_value?.aggr === 'value_count')

    const {get, update, set} = useObjectState({
        name: "AggregationForm",
        value: _value,
        defaultValue: {
            aggr: "sum",
            by_field: {value: "", ref: true},
            save_as: ""
        },
        onChange
    })

    const handleAggrChange = (value) => {
        const changeData = {aggr: value}
        if(value === 'value_count') {
            setDisabled(true)
            changeData.by_field = {value:"type", ref: true}
        } else {
            setDisabled(false)
        }

        update(changeData)
    }

    return <div className="flexLine">
        <AggregationOperation
            value={get()?.aggr}
            onChange={handleAggrChange}/>
        <span style={{marginLeft: 10}}>
            <RefInput
                fullWidth={true}
                autocomplete="event"
                locked={true}
                disabled={disabled}
                value={get()?.by_field}
                defaultType={true}
                label="Event data"
                onChange={v => set("by_field", v)}
                width={"250px"}
            />
        </span>
        <Tag style={{margin: 10}}>as</Tag>
            <TextField size="small"
                       variant="outlined"
                       label="Aggregation Name"
                       value={get()?.save_as || ""}
                       onChange={(ev) => set("save_as", ev.target.value)}
                       style={{width: 180}}
            />
    </div>
}
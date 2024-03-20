import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import {FieldBox} from "./FieldBox";

export function TimeSpanField({value, label, onChange}) {

    const defaultValue = {
        value: 0,
        unit: "day"
    }

    value = {
      ...defaultValue,
      value
    }

    const [data, setData] = useState(value)

    const handleChange = (key, value) => {
        const _data = {
            ...data,
            [key]: value
        }
        setData(_data)
        if(onChange instanceof Function) {
            onChange(_data)
        }
    }

    return <FieldBox>
    <TextField

        variant="outlined"
        size="small"
        label={label || "Value"}
        value={data.value}
        style={{width: 150}}
        onChange={(ev)=>handleChange("value", ev.target.value)}
        />
        <TextField
        select
        variant="outlined"
        size="small"
        label={label || "Unit"}
        value={data.unit}
        style={{width: 100}}
        onChange={(ev)=>handleChange("unit", ev.target.value)}
    >

        <MenuItem value="minute">minute(s)</MenuItem>
        <MenuItem value="hour">hour(s)</MenuItem>
        <MenuItem value="day" selected>day(s)</MenuItem>
        <MenuItem value="week">week(s)</MenuItem>
        <MenuItem value="month">month(s)</MenuItem>
        <MenuItem value="year">year(s)</MenuItem>
    </TextField></FieldBox>
}
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

export function IntervalSelect({value, label, onChange}) {
    return  <TextField
        select
        variant="outlined"
        size="small"
        label={label || "Interval"}
        value={value}
        style={{width: 150}}
        onChange={onChange}
    >
        <MenuItem value={60*6}>6 hours</MenuItem>
        <MenuItem value={60*12}>12 hours</MenuItem>
        <MenuItem value={60*24} selected>1 day</MenuItem>
        <MenuItem value={60*24*3}>3 days</MenuItem>
        <MenuItem value={60*24*7}>7 days</MenuItem>
        <MenuItem value={60*24*14}>14 days</MenuItem>
        <MenuItem value={60*24*30}>30 days</MenuItem>
    </TextField>
}
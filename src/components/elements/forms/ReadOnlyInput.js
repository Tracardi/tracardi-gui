import InputAdornment from "@mui/material/InputAdornment";
import {IoRefreshCircle} from "react-icons/io5";
import TextField from "@mui/material/TextField";
import React from "react";

export default function ReadOnlyInput({label, value, hint=null, onReset}) {
    return <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label={label}
        style={{marginTop: 8}}
        size="small"
        value={value}
        disabled={true}
        helperText={hint}
        InputProps={onReset ? {
            endAdornment: <InputAdornment position="end">
                <IoRefreshCircle size={22} onClick={onReset} style={{cursor: "pointer"}}/>
            </InputAdornment>
        } : null}
    />
}

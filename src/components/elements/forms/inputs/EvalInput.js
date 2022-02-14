import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import EvalAdornment from "./EvalAdornment";
import InputAdornment from "@mui/material/InputAdornment";
import PathTextAdornment from "./PathTextAdornment";

export function SourceInput({value, onChange}) {
    return <PathTextAdornment value={value} onChange={onChange}/>
}
export function EvalInput({label, value, onChange, fullWidth = false, error, helperText, style, required, autoCastValue}) {

    const [castValue, setCastValue] = useState(autoCastValue || false);

    const handleChange = (event) => {
        if (onChange) {
            onChange(event, castValue)
        }
    };

    return <TextField
        required={required}
        fullWidth={fullWidth}
        size="small"
        style={style}
        type='text'
        variant="standard"
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        InputProps={{
            endAdornment: <InputAdornment position="end">
                <EvalAdornment value={castValue} onChange={setCastValue}/>
            </InputAdornment>,

        }}
        label={label}
    />
}

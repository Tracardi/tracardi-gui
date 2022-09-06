import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import EvalAdornment from "./EvalAdornment";
import InputAdornment from "@mui/material/InputAdornment";
import PathTextAdornment from "./PathTextAdornment";

export function SourceInput({value, onChange, lock=true, lockValue=null}) {
    return <PathTextAdornment value={value}
                              onChange={onChange}
                              lock={lock}
                              lockValue={lockValue}
    />
}
export function EvalInput({label, value: initValue, onChange, fullWidth = false, error, helperText, style, required, autoCastValue}) {

    const [castValue, setCastValue] = useState(autoCastValue || false);
    const [value,setValue] = React.useState(initValue || "");

    const handleChange = (event) => {
        setValue(event.target.value)
        if (onChange) {
            onChange(event.target.value, castValue)
        }
    };

    const handleCastChange = (cast) => {
        setCastValue(cast)
        if (onChange) {
            onChange(value, cast)
        }
    }

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
                <EvalAdornment value={castValue} onChange={handleCastChange}/>
            </InputAdornment>,

        }}
        label={label}
    />
}

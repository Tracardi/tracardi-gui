import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import EvalAdornment from "./EvalAdornment";
import InputAdornment from "@mui/material/InputAdornment";
import PathTextAdornment from "./PathTextAdornment";

export function SourceInput({value, onChange, lock=true, lockValue=null, disableSwitching=false}) {
    return <PathTextAdornment value={value}
                              onChange={onChange}
                              lock={lock}
                              lockValue={lockValue}
                              disableSwitching={disableSwitching}
    />
}
export function EvalInput({label, value: initValue, onChange, disabled, fullWidth = false, error, helperText, style,
                              required,
                              autoCastValue,
                              disableCast=false
                          }) {

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

    function showCasingIcon() {
        if(disableCast) {
            return {}
        }
        return {
            endAdornment: <InputAdornment position="end">
                <EvalAdornment value={castValue} onChange={handleCastChange}/>
            </InputAdornment>,

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
        InputProps={showCasingIcon()}
        label={label}
        disabled={disabled}
    />
}

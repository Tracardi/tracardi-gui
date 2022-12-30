import InputAdornment from "@mui/material/InputAdornment";
import {VscLink} from "react-icons/vsc";
import {IoTextOutline} from "react-icons/io5";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";

export default function RefInput({fullWidth, style, value: _value = null, disabled, errorMessage=null, label, onChange, defaultType=false, locked=false}) {

    if(!_value) {
        _value = {
            value: "",
            ref: defaultType
        }
    }

    const [value, setValue] = useState(_value)

    function handleChange(value) {
        if(onChange instanceof Function) {
            onChange(value)
        }
    }

    function handleValueChange(e) {
        const _value = {...value, value:e.target.value}
        setValue(_value)
        handleChange(_value)
    }

    function handleTypeChange(v) {
        if (!locked) {
            const _value = {...value, ref: v}
            setValue(_value)
            handleChange(_value)
        }
    }

    return <TextField
        fullWidth={fullWidth}
        size="small"
        style={style}
        value={value.value}
        onChange={handleValueChange}
        error={errorMessage !== null}
        disabled={disabled}
        helperText={errorMessage}
        InputProps={{
            startAdornment: <InputAdornment position="start" style={{cursor: "pointer"}}>
                {
                    value.ref
                        ? <VscLink size={20} onClick={()=>handleTypeChange(false)}/>
                        : <IoTextOutline size={20} onClick={()=>handleTypeChange(true)}/>
                }

            </InputAdornment>
        }}
        label={label}
        variant="outlined"
    />
}
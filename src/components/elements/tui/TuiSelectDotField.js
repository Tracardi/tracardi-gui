import AutoComplete from "../forms/AutoComplete";
import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import { EvalInput } from "../forms/inputs/EvalInput";
import EvalAutoComplete from "../forms/EvalAutoComplete";


function TuiSelectDotField({index, label = "Path to field", value = "", disabled = false, errorMessage = null, onChange = null, style = null, autoCastValue: castValue}) {

    const [textValue, setTextValue] = useState(value);
    const [selectValue, setSelectValue] = useState({id: value, name: value});

    const handleTextChange = (e, autoCastValue) => {
        const value = e.target.value
        setTextValue(value);
        setSelectValue({id: value, name: value});
        if (onChange) {
            onChange(value, autoCastValue)
        }
        e.preventDefault();
    }

    const handleValueChange = (value, autoCastValue) => {
        if (value !== null) {
            setSelectValue(value);
            setTextValue(value?.name);
            if (onChange) {
                onChange(value?.name, autoCastValue)
            }
        }
    }

    if (index === null || !["event", "profile", "session", "flow"].includes(index)) {
        return <EvalInput label={label}
                          value={textValue}
                          onChange={handleTextChange}
                          error={errorMessage}
                          helperText={errorMessage}
                          style={style}
                          autoCastValue={castValue}
        />
    } else {
        const url = `/storage/mapping/${index}/metadata`
        return <EvalAutoComplete
            solo={true}
            autoCastValue={castValue}
            style={style}
            disabled={disabled}
            error={errorMessage}
            placeholder={label}
            url={url}
            initValue={selectValue}
            onSetValue={handleValueChange}
            onChange={handleValueChange}
            multiple={false}
        />
    }
}

export default TuiSelectDotField
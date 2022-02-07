import AutoComplete from "../forms/AutoComplete";
import React, {useState} from "react";
import TextField from "@mui/material/TextField";


function TuiSelectDotField({index, label = "Path to field", value = "", disabled = false, errorMessage = null, onChange = null, style = null}) {

    const [textValue, setTextValue] = useState(value);
    const [selectValue, setSelectValue] = useState({id: value, name: value});

    const handleTextChange = (e) => {
        const value = e.target.value
        setTextValue(value);
        setSelectValue({id: value, name: value});
        if (onChange) {
            onChange(value)
        }
        e.preventDefault();
    }

    const handleValueSelect = (value) => {
        if (value !== null) {
            setSelectValue(value);
            setTextValue(value?.name);
            if (onChange) {
                onChange(value?.name)
            }
        }
    }

    const handleValueChange = (value) => {
        setSelectValue({id: value, name: value});
        setTextValue(value);
        if (onChange) {
            onChange(value)
        }
    }

    if (index === null || !["event", "profile", "session", "flow"].includes(index)) {
        return <TextField label={label}
                          value={textValue}
                          onChange={handleTextChange}
                          variant="outlined"
                          size="small"
                          error={errorMessage}
                          helperText={errorMessage}
                          style={style}
        />
    } else {
        const url = `/storage/mapping/${index}/metadata`
        return <AutoComplete
            solo={true}
            style={style}
            disabled={disabled}
            error={errorMessage}
            placeholder={label}
            url={url}
            initValue={selectValue}
            onSetValue={handleValueSelect}
            onChange={handleValueChange}
            multiple={false}
        />
    }
}

export default TuiSelectDotField
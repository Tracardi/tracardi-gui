import React from "react";
import {isString} from "../../../../misc/typeChecking";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export default function DottedPathInput({value, label, onChange, error = false, helperText = null, width=460}) {

    let [sourceValue, pathValue] = isString(value) ? value.split('@') : ["", ""]

    if (typeof pathValue === 'undefined' && sourceValue) {
        pathValue = sourceValue
        sourceValue = ''
    }

    const [path, setPath] = React.useState(pathValue || "");
    const [source, setSource] = React.useState(sourceValue || "");

    const sources = [
        {
            value: '',
            label: '',
        },
        {
            value: 'payload',
            label: 'payload',
        },
        {
            value: 'profile',
            label: 'profile',
        },
        {
            value: 'event',
            label: 'event',
        },
        {
            value: 'session',
            label: 'session',
        },
        {
            value: 'flow',
            label: 'flow',
        },
    ];

    const handleExternalOnChange = (path, source) => {
        if (onChange) {
            onChange(`${source}@${path}`)
        }
    }

    const handlePathChange = (event) => {
        setPath(event.target.value);
        handleExternalOnChange(event.target.value, source);
        event.preventDefault();
    };

    const handleSourceChange = (event) => {
        setSource(event.target.value);
        handleExternalOnChange(path, event.target.value);
        event.preventDefault();
    };

    return <div style={{display: "flex"}}>
        <TextField select
                   label="Source"
                   variant="outlined"
                   size="small"
                   value={source}
                   onChange={handleSourceChange}
                   style={{width: 120, marginRight: 5}}
        >
            {sources.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
        <TextField label={label}
                   value={path}
                   onChange={handlePathChange}
                   variant="outlined"
                   size="small"
                   style={{width: width}}
                   error={error}
                   helperText={helperText}
        />
    </div>
}
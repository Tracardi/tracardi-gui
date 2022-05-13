import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, {useState} from "react";

export default function TuiApiUrlInput({value, options, onChange, fullWidth=true}) {

    const [endpoint, setEndpoint] = useState(value);

    const handleEndpoint = (value) => {
        setEndpoint(value);
        if(onChange) onChange(value)
    }

    return <Autocomplete
        options={
            options || []
        }
        value={endpoint}
        onChange={(e, v) => handleEndpoint(v)}
        freeSolo
        fullWidth={fullWidth}
        renderInput={(params) => (
            <TextField
                {...params}
                onChange={({target}) => handleEndpoint(target.value)}
                label='API Endpoint URL'
                margin='normal'
                size="small"
                variant='outlined'
                placeholder="http://localhost:8686"
            />
        )}
    />
}
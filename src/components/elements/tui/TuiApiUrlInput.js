import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, {useState} from "react";

export default function TuiApiUrlInput({value, options, onChange, errorMessage=null, fullWidth=true}) {

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
                helperText={errorMessage}
                FormHelperTextProps={{ style: { color: "#d81b60" }}}
                error={errorMessage!==null}
                placeholder="http://localhost:8686"
            />
        )}
    />
}
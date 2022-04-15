import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, {useState} from "react";
import {apiUrlStorage} from "../../remote_api/entrypoint";

export default function EndpointInput({options, onChange}) {

    const [endpoint, setEndpoint] = useState(apiUrlStorage().read([]));

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
        fullWidth
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
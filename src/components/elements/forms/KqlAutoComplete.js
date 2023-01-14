import React, {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";

export function Kql() {

    const [kql, setKql] = useState({value: "dddd", token: ""})
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const mounted = useRef(false);

    useEffect(() => {
        let isSubscribed = true;
        setProgress(true);
        setOpen(true)
        asyncRemote({
            url: "/event/query/autocomplete?query=" + kql.value,
            method: "get",
        }).then((response) => {
            if (response && isSubscribed) {

                let options = response.data

                if (typeof options !== "undefined" && options !== null) {
                    setOptions(options);
                } else {
                    setOptions([])
                }
            }
        }).catch((e) => {

        }).finally(() => {
                if (isSubscribed) {
                    setProgress(false);
                }
            }
        )
        return () => {
            isSubscribed = false
        }
    }, [kql])

    const handleTyping = (ev, v, reason) => {
        console.log(v, reason)
        setKql({...kql, value: v})
    }

    const handleSelect = (event, v) => {
        if(v) {
            setKql({...kql, value: kql.value + " " + v.value})
        }
    }

    return (
        <Autocomplete
            disablePortal
            open={open}
            onClose={() => {
                setOpen(false);
                setOptions([]);
            }}
            id="autocomplete"
            autoComplete={false}
            freeSolo
            fullWidth={true}
            filterSelectedOptions={true}
            filterOptions={(options) => options}
            onInputChange={handleTyping}
            onChange={handleSelect}
            getOptionLabel={(option) => {
                return option?.value || ""
            }}
            renderOption={(props, option, state) => {
                return <div {...props} style={{display: "flex"}}>
                    <span style={{display: "flex", width: 100, justifyContent: "left"}}>
                        <span
                            style={{backgroundColor: "#ef6c00", color: "white", padding: "1px 5px", borderRadius: 5, marginRight: 5, fontSize: 11, textTransform: "uppercase"}}>{option.token}</span>
                    </span>
                    <span style={{display: "table-cell", width: 700}}>{option.value}</span>
                    <span style={{display: "table-cell", fontSize: 11, color: "gray"}}>{option.desc}</span>
                </div>
            }}
            value={kql}
            options={options}
            renderInput={(params) => <TextField {...params}
                                                label="Filter"
                                                size="small"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {progress ?
                                                                <CircularProgress color="inherit" size={20}
                                                                                  style={{marginRight: 30}}
                                                                /> : <div style={{marginRight: 30}}></div>}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
            />}
        />
    );
}
import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {asyncRemote} from "../../../remote_api/entrypoint";

export default function KqlAutoComplete() {

    const [kql, setKql] = useState({value: "dddd", token: ""})
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [current, setCurrent] = React.useState(false);

    useEffect(() => {
        let isSubscribed = true;
        setProgress(true);
        setOpen(true)
        asyncRemote({
            url: "/event/query/autocomplete?query=" + kql.value,
            method: "get",
        }).then((response) => {
            if (response && isSubscribed) {
                let options = response.data.next
                setCurrent(response.data.current)
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
        setKql({...kql, value: v})
    }

    const handleSelect = (event, v) => {
        if (v?.value) {
            let base
            if (current?.value !== "" && current?.token === v.token) {
                base = kql.value.substring(0, kql.value.length - current.value.length)
            } else {
                base = kql.value
            }


            if (v.space === null) {
                // APPEND_NONE
                v = base + v.value
            } else if (v.space === 0) {
                // APPEND_NONE
                v = base + " " + v.value + " "
            } else if (v.space === -1) {
                // APPEND_BEFORE
                v = base + " " + v.value
            } else if (v.space === 1) {
                // APPEND_AFTER
                v = base + v.value + " "
            } else {
                v = base + v.value
            }

            setKql({...kql, value: v})
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
                            style={{
                                backgroundColor: option.color,
                                color: "white",
                                padding: "1px 5px",
                                borderRadius: 5,
                                marginRight: 5,
                                fontSize: 11,
                                textTransform: "uppercase"
                            }}>{option.token}</span>
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
                                                                /> : <div style={{marginRight: 30}}/>}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
            />}
        />
    );
}
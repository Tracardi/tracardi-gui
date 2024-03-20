import React, {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useDebounce} from "use-debounce";
import {useRequest} from "../../../remote_api/requestClient";

export default function KqlAutoComplete({index, label, value, onChange, onKeyPressCapture, fullWidth=true, width=645}) {

    const [query, setQuery] = useState({value: value || "", token: null})
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [current, setCurrent] = React.useState(false);
    const [debouncedQuery] = useDebounce(query, 500);

    const isFocused = useRef(false);
    const {request} = useRequest()

    useEffect(() => {
        let isSubscribed = true;

        if(!isFocused.current){
            return
        }

        if(typeof query?.value !== "undefined") {
            setProgress(true);
            request({
                url: `/${index}/query/autocomplete?query=${debouncedQuery?.value}`,
                method: "get",
            }).then((response) => {
                if (response && isSubscribed) {
                    let options = response.data.next
                    setCurrent(response.data.current)
                    if (typeof options !== "undefined" && options !== null) {
                        if(isFocused.current) {
                            setOpen(true)
                        }
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
        }

        return () => {
            isSubscribed = false
        }
    }, [debouncedQuery])

    const handleChange = (value) => {
        if(onChange instanceof Function) {
            onChange(value)
        }
    }

    const handleTyping = (ev, v, reason) => {
        setQuery({...query, value: v})
        handleChange(v)
    }

    const handleSelect = (event, v) => {
        if (v?.value) {
            let base
            if (current?.value !== "" && current?.token === v.token) {
                base = query.value.substring(0, query.value.length - current.value.length)
            } else {
                base = query.value
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
                v = base + v.value
            } else {
                v = base + v.value
            }

            setQuery({...query, value: v})
            handleChange(v)
        }
    }

    const handleFocus = () => {
        isFocused.current = true
        setOpen(true);
    }

    const handleBlur = () => {
        isFocused.current = false
        setOpen(false);
    }

    const handleKeyPressCapture = (e) => {
        setOpen(false)
        if(onKeyPressCapture instanceof Function) {
            onKeyPressCapture(e)
        }
    }

    return (
        <Autocomplete
            disablePortal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            id="autocomplete"
            autoComplete={false}
            freeSolo
            fullWidth={fullWidth}
            filterSelectedOptions={true}
            filterOptions={(options) => options}
            onInputChange={handleTyping}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleSelect}
            getOptionLabel={(option) => {
                return option?.value || ""
            }}
            style={{width: fullWidth ? "100%" : width}}
            renderOption={(props, option, state) => {
                return <div {...props} style={{display: "flex"}}>
                    <span style={{display: "flex", width: 100, justifyContent: "left"}}>
                        <span
                            style={{
                                backgroundColor: option.color,
                                color: "white",
                                padding: "3px 10px",
                                borderRadius: 5,
                                marginRight: 5,
                                fontSize: 12,
                                textTransform: "uppercase"
                            }}>{option.token}</span>
                    </span>
                    <span style={{display: "table-cell", marginRight: 10}}>{option.value}</span>
                    {option.desc &&
                    <span style={{display: "table-cell", fontSize: 12, color: "gray"}}>{option.desc}</span>}
                </div>
            }}
            value={query}
            options={options}
            renderInput={(params) => <TextField {...params}
                                                label={label}
                                                size="small"
                                                onKeyPressCapture={handleKeyPressCapture}
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
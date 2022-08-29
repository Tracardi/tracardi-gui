import React, {useEffect, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from "prop-types";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {convertResponseToAutoCompleteOptions} from "../../../misc/converters";
import {isObject, isString} from "../../../misc/typeChecking";

const AutoComplete = ({
                          placeholder, error: errorMessage = null, endpoint, token=null, defaultValueSet, initValue, value = null, onSetValue,
                          onChange, onlyValueWithOptions = false, disabled, fullWidth = false,
                          renderOption
                      }) => {

    const getValue = (initValue) => {
        if (!initValue) {
            initValue = {id: "", name: ""}
        } else if (isString(initValue)) {
            initValue = {name: initValue, id: initValue}
        }
        return initValue
    }

    const [error, setError] = React.useState(errorMessage);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState(defaultValueSet || []);
    const [progress, setProgress] = React.useState(false);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;
    const [selectedValue, setSelectedValue] = React.useState(getValue(initValue));

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        setError(errorMessage)
        if (value) {
            setSelectedValue(value)
        }
        return () => {
            mounted.current = false;
        }
    }, [errorMessage, value])

    const handleLoading = async () => {
        if (mounted.current) {
            if (isObject(endpoint)) {
                setProgress(true);
                try {
                    setOpen(true)
                    const response = await asyncRemote(endpoint, token)
                    if (response && mounted.current) {
                        let options = convertResponseToAutoCompleteOptions(response)

                        if (Array.isArray(defaultValueSet) && defaultValueSet.length > 0) {
                            options = defaultValueSet.concat(options)
                        }

                        if (typeof options !== "undefined" && options !== null) {
                            setOptions(options);
                        } else {
                            setOptions([])
                        }

                        setError(null)
                    }

                } catch (e) {
                    if (mounted.current && e) {
                        const errors = getError(e)
                        setError(errors[0].msg)
                    }
                } finally {
                    if (mounted.current) {
                        setProgress(false);
                    }
                }
            } else {
                if (mounted.current && Array.isArray(defaultValueSet) && defaultValueSet.length > 0) {
                    setOptions(defaultValueSet);
                    setOpen(true);
                }
            }
        }
    }

    const handleValueSet = (value) => {

        if (!value) {
            value = {id: "", name: ""}
        }

        if (typeof value === "string") {
            value = {id: value, name: value}
        }

        setSelectedValue(value)

        if (onSetValue instanceof Function) {
            onSetValue(value);
        }
    }

    const handleChange = (value, reason) => {
        if (onlyValueWithOptions === false && reason === "input") {

            if (!value) {
                value = {id: "", name: ""}
            }

            if (typeof value === "string") {
                value = {id: value, name: value}
            }

            setSelectedValue(value)

            if (onChange instanceof Function) {
                onChange(value);
            }
        }
    }

    return (
        <Autocomplete
            freeSolo={!onlyValueWithOptions}
            multiple={false}
            fullWidth={fullWidth}
            style={fullWidth ? {width: "100%"} : {width: 300}}
            open={open}
            onOpen={handleLoading}
            onClose={() => {
                setOpen(false);
                setOptions([]);
            }}
            isOptionEqualToValue={(option, value) => {
                return option.id === value.id
            }}
            getOptionLabel={(option) => {
                return option?.name || option?.id || ""
            }}
            options={options}
            loading={loading}
            value={selectedValue}
            disabled={disabled}
            onChange={(event, value) => {
                handleValueSet(value);
            }}
            onInputChange={(ev, value, reason) => {
                handleChange(value, reason)
            }}
            renderOption={renderOption}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={placeholder}
                    error={(typeof error !== "undefined" && error !== '' && error !== null)}
                    helperText={error}
                    FormHelperTextProps={{style: {color: "#d81b60"}}}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {progress ?
                                    <CircularProgress color="inherit" size={20}
                                                      style={{marginRight: onlyValueWithOptions ? 0 : 25}}
                                    /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

AutoComplete.propTypes = {
    placeholder: PropTypes.string,
    error: PropTypes.string,
    endpoint: PropTypes.object,
    defaultValueSet: PropTypes.array,
    onSetValue: PropTypes.func,
    onChange: PropTypes.func,
    onlyValueWithOptions: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
}

export default AutoComplete;
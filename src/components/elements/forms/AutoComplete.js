import React, {useEffect, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from "prop-types";
import {isObject, isString} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";

const AutoComplete = ({showAlert, placeholder, error, url, initValue, onDataLoaded, onSetValue, onChange, solo, disabled, multiple=false, fullWidth=false}) => {

    if (typeof solo == "undefined") {
        solo = true
    }

    if(multiple === true) {
        if(isString(initValue)) {
            if(initValue === "") {
                initValue = []
            } else {
                initValue = [initValue]
            }
        } else if (isObject(initValue)) {
            initValue = undefined
        }
    } else {
        if(!initValue) {
            initValue = {}
        }
    }

    console.log(initValue)

    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, [])

    const handleDataLoaded = (response, onDataLoaded) => {
        if (!onDataLoaded) {
            if(Array.isArray(response.data?.result)) {
                return response.data?.result.map((key) => {
                    return {name: key, id: key}
                });
            } else if(isObject(response.data?.result)) {
                return objectMap(response.data?.result, (key, value) => {
                    return {name: value, id: key}
                })
            }
            return []
        } else {
            return onDataLoaded(response)
        }
    }

    const handleLoading = async () => {
        if(mounted.current) {
            setProgress(true);
            try {
                setOpen(true);
                const response = await asyncRemote({url})
                if (response && mounted.current) {
                    const options = handleDataLoaded(response, onDataLoaded)

                    if (typeof options !== "undefined" && options !== null) {
                        setOptions(options);
                    } else {
                        setOptions([])
                    }
                }

            } catch(e) {
                if(mounted.current && e) {
                    const errors = getError(e)
                    showAlert({message: errors[0].msg, type: "error", hideAfter: 4000});
                }
            } finally {
                 if(mounted.current) {
                     setProgress(false);
                 }
            }
        }
    }

    const handleValueSet = (value) => {
        if(multiple === true && Array.isArray(value)) {
            value = value.map((v) => { return isString(v) ? {id:v, name: v} : v })
        } else if (typeof value === "string") {
            value = {id: value, name: value}
        }

        if (onSetValue) {
            onSetValue(value);
        }
    }

    const handleChange = (value) => {
        if(isString(value)) {
            value = {id: value, name: value}
        }
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <Autocomplete
            freeSolo={solo}
            multiple={multiple}
            fullWidth={fullWidth}
            style={fullWidth ? {width: "100%"} : {width: 300}}
            open={open}
            onOpen={handleLoading}
            onClose={() => {
                setOpen(false);
                setOptions([]);
            }}
            isOptionEqualToValue={(option, value) => {return option.id === value.id}}
            getOptionLabel={(option) => {
                return option?.name || option?.id || ""
            }}
            options={options}
            loading={loading}
            value={initValue}
            disabled={disabled}
            onChange={(event, value) => {
                handleValueSet(value);
            }}
            onInputChange={(ev, value, reason) => {
                handleChange(value)
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={placeholder}
                    error={(typeof error !== "undefined" && error !== '' && error !== null)}
                    helperText={error}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {progress ? <CircularProgress color="inherit" size={20} style={{marginRight: 25}}/> : null}
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
    url: PropTypes.string.isRequired,
    onDataLoaded: PropTypes.func,
    onSetValue: PropTypes.func,
    onChange: PropTypes.func,
    solo: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    multiple: PropTypes.bool
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(AutoComplete)
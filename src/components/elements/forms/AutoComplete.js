import React, {useEffect, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from "prop-types";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {convertResponseToAutoCompleteOptions} from "../../../misc/converters";
import {isString} from "../../../misc/typeChecking";

const AutoComplete = ({showAlert, placeholder, error, endpoint, defaultValueSet = [], initValue, onSetValue, onChange, onlyValueWithOptions = false, solo = true, disabled, fullWidth = false, renderOption}) => {

    const getValue = (initValue) => {
        if (!initValue) {
            initValue = {id: "", name: ""}
        } else if (isString(initValue)) {
            initValue = {name: initValue, id: initValue}
        }
        return initValue
    }

    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;
    const [selectedValue, setSelectedValue] = React.useState(getValue(initValue));

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, [])

    const handleLoading = async () => {
        if (mounted.current) {
            setProgress(true);
            try {
                setOpen(true);
                const response = await asyncRemote(endpoint)
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
                }

            } catch (e) {
                if (mounted.current && e) {
                    const errors = getError(e)
                    showAlert({message: errors[0].msg, type: "error", hideAfter: 4000});
                }
            } finally {
                if (mounted.current) {
                    setProgress(false);
                }
            }
        }
    }

    const handleValueSet = (value) => {
        if (typeof value === "string") {
            value = {id: value, name: value}
        }

        setSelectedValue(value)

        if (onSetValue instanceof Function) {
            onSetValue(value);
        }
    }

    const handleChange = (value) => {
        if(onlyValueWithOptions === false) {
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
                handleChange(value)
            }}
            renderOption={renderOption}
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
                                {progress ?
                                    <CircularProgress color="inherit" size={20}
                                                      style={{marginRight: solo ? 25 : 0}}/> : null}
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
    onSetValue: PropTypes.func,
    onChange: PropTypes.func,
    onlyValueWithOptions: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
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
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from "prop-types";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";

const AutoComplete = ({showAlert, placeholder, error, url, initValue, onDataLoaded, onSetValue, onChange, solo, disabled}) => {

    if (typeof solo == "undefined") {
        solo = true
    }

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(initValue);
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;

    const handleDataLoaded = (result, onDataLoaded) => {
        if (!onDataLoaded) {
            if(Array.isArray(result.data?.result)) {
                return result.data?.result.map((key) => {
                    return {name: key, id: key}
                });
            } else if(isObject(result.data?.result)) {
                return objectMap(result.data?.result, (key, value) => {
                    return {name: value, id: key}
                })
            }
            return []
        } else {
            return onDataLoaded(result)
        }
    }

    const handleLoading = () => {
        setProgress(true);
        request(
            {url},
            setProgress,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            },
            (result) => {
                setOpen(true);
                if (result) {
                    const options = handleDataLoaded(result, onDataLoaded)

                    if (typeof options !== "undefined" && options !== null) {
                        setOptions(options);
                    } else {
                        setOptions([])
                    }
                }
            }
        );

    }

    const handleValueSet = (value) => {
        setValue(value);
        if (onSetValue) {
            onSetValue(value);
        }
    }

    const handleChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <Autocomplete
            freeSolo={solo}

            style={{width: 300}}
            open={open}
            onOpen={() => {
                handleLoading();
            }}
            onClose={() => {
                setOpen(false);
                setOptions([]);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => {
                return option?.name || option?.id || ""
            }}
            options={options}
            loading={loading}
            value={value}
            disabled={disabled}
            onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                    newValue = {id: null, name: newValue}
                }
                handleValueSet(newValue);
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
                                {progress ? <CircularProgress color="inherit" size={20}/> : null}
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
    solo: PropTypes.bool,
    disabled: PropTypes.bool,
    initValue: PropTypes.object
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
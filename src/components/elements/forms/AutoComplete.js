import React, {useEffect, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from "prop-types";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import {asyncRemote} from "../../../remote_api/entrypoint";

const AutoComplete = ({showAlert, placeholder, error, url, initValue, onDataLoaded, onSetValue, onChange, solo, disabled}) => {

    if (typeof solo == "undefined") {
        solo = true
    }

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(initValue || {});
    const [options, setOptions] = React.useState([]);
    const [progress, setProgress] = React.useState(false);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
        setValue(initValue)
    }, [initValue])

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
                            showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            } finally {
                 if(mounted.current) {
                     setProgress(false);
                 }
            }
        }
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
            getOptionSelected={(option, value) => (option.id === value.id)}
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
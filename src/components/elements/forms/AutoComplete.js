import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from "prop-types";

const AutoComplete = ({showAlert, placeholder, error, url, onDataLoaded, initValue, onSetValue, solo, disabled}) => {

    if(typeof solo == "undefined") {
        solo = true
    }

    const [open, setOpen] = React.useState(false);
    const [value, _setValue] = React.useState(initValue);
    const [options, setOptions] = React.useState([]);
    const loading = open && typeof options !== "undefined" && options?.length >= 0;
    const [progress, setProgress] = React.useState(false);

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }
        setProgress(true);
        request(
            {url},
            setProgress,
            (e) => {
                if(e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter:2000});
                }
            },
            (result) => {

                if (active) {
                    const options = onDataLoaded(result)
                    if(typeof options !== "undefined" && options !== null) {
                        if(Array.isArray(options) && options.length === 0) {
                            setOptions([{name: "None", key: "none"}])
                        } else {
                            setOptions(options);
                        }
                    }
                }
            }
        );

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const setValue = (value) => {
        _setValue(value);
        if(onSetValue) {
            onSetValue(value);
        }
    }

    return (
        <Autocomplete
            freeSolo={solo}

            style={{width: 300}}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            value={value}
            disabled={disabled}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                newInputValue = {name: newInputValue, id: newInputValue}
                setValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={placeholder}
                    error={(typeof error !== "undefined" && error !== '' && error !== null )}
                    helperText={error}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {progress ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
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
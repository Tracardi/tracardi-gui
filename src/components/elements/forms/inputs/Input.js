import React from "react";
import TextField from "@mui/material/TextField";
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

export default function Input({onEnterPressed, onChange, label, initValue, error, variant}) {
    const useStyles = makeStyles(() => (
        {
            root: {
                width: '100%'
            } 
        }
    ));
    const classes = useStyles();
    const [searchValue, setSearchValue] = React.useState(initValue);

    const handleNameChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(event);
            event.preventDefault();
        }
        setSearchValue(event.target.value);
    };

    const handleKeyPress = (ev) => {
        if (ev.key === 'Enter' && typeof (onEnterPressed) != "undefined") {
            onEnterPressed(ev.target.value);
            ev.preventDefault();
        }
    };

    return <div className={classes.root}>
        <TextField label={label}
                   value={searchValue}
                   onChange={handleNameChange}
                   onKeyPressCapture={handleKeyPress}
                   className={classes.root}
                   error={error}
                   variant={variant}
                   size="small"
        />
    </div>
}

Input.propTypes = {
    onEnterPressed: PropTypes.func,
    onChange: PropTypes.func,
    label: PropTypes.string,
    initValue: PropTypes.string,
    error: PropTypes.object,
    variant: PropTypes.string   
} 
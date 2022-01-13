import makeStyles from '@mui/styles/makeStyles';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import React from "react";
import Select from "@mui/material/Select";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SelectItems({children, label, value, onChange}) {
    const classes = useStyles();
    return <FormControl variant="outlined" size="small"  className={classes.formControl}>
        <InputLabel id="origin-select-label">{label}</InputLabel>
        <Select
            labelId="origin-select-label"
            id="origin"
            value={value}
            onChange={onChange}
            label={label}
        >
            {children}
        </Select>
    </FormControl>
}

SelectItems.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func
}
import {makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import React from "react";
import Select from "@material-ui/core/Select";

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
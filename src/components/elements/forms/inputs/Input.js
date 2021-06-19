import React from "react";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

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
        <TextField id="search-input" label={label}
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
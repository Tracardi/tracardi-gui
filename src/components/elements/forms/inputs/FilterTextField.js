import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";

const FilterTextField = ({label, onChange, onSubmit, initValue="", variant="outlined"}) => {

    const [value, setValue] = useState(initValue);

    useEffect(()=> {
        setValue(initValue);
    }, [initValue])

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(event);
            event.preventDefault();
        }
        setValue(event.target.value);
    };

    const handleKeyPress = (ev) => {
        if (ev.key === 'Enter' && typeof (onSubmit) != "undefined") {
            onSubmit(ev.target.value);
            ev.preventDefault();
        }
    };

    const handleBlur = (ev) => {
        if (typeof (onSubmit) != "undefined") {
            onSubmit(ev.target.value);
            ev.preventDefault();
        }
    };

    return <TextField id="filter-input" label={label}
                      value={value}
                      onChange={handleChange}
                      onBlurCapture={handleBlur}
                      onKeyPressCapture={handleKeyPress}
                      variant={variant}
                      fullWidth
                      size="small"
    />
}

export default FilterTextField;
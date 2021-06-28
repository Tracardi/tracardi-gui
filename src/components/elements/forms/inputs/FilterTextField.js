import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

const FilterTextField = ({label, onChange, onSubmit, variant="outlined"}) => {

    const [value, setValue] = useState("");

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

    return <TextField id="filter-input" label={label}
                      value={value}
                      onChange={handleChange}
                      onKeyPressCapture={handleKeyPress}
                      variant={variant}
                      fullWidth
                      size="small"
    />
}

export default FilterTextField;
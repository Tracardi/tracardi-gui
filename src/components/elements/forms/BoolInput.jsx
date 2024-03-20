import React, {useState} from "react";
import Switch from "@mui/material/Switch";

export default function BoolInput({value = false, label, onChange = () => {}}) {
    const [boolValue, setBoolValue] = useState(value || false);

    const handleChange = (value) => {
        setBoolValue(value);
        if (onChange) {
            onChange(value);
        }
    }

    return <div style={{display: "flex", alignItems: "center"}}>
        <Switch
            checked={boolValue}
            onChange={() => handleChange(!boolValue)}
        />
        <span>{label}</span>
    </div>

}
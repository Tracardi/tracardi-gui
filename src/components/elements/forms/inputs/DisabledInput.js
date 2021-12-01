import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import Button from "../Button";
import {VscLock} from "@react-icons/all-files/vsc/VscLock";
import {VscUnlock} from "@react-icons/all-files/vsc/VscUnlock";

export default function DisabledInput({value, label, onChange}) {

    const [inputValue, setInputValue] = useState(value);
    const [disabled, setDisabled] = useState(true);

    const handleChange = (value) => {
        setInputValue((value));
        if(onChange) {
            onChange(value)
        }
    }

    return <div style={{display:"flex"}}>
            <TextField
                label={label}
                value={inputValue}
                onChange={(ev) => {
                    handleChange(ev.target.value)
                }}
                size="small"
                disabled={disabled}
                variant="outlined"
                fullWidth
            />
            <Button label={disabled ? "Unlock": "Lock"} onClick={()=>setDisabled(!disabled)} style={{padding: "6px 10px"}}
            icon={disabled ? <VscUnlock size={20}/> : <VscLock size={20}/>}
            />
        </div>
}
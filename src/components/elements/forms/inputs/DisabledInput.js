import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import Button from "../Button";
import {VscLock, VscUnlock} from "react-icons/vsc";

export default function DisabledInput({value, label, onChange}) {

    const [disabled, setDisabled] = useState(true);

    const handleChange = (value) => {
        if(onChange instanceof Function) {
            onChange(value)
        }
    }

    return <div style={{display:"flex"}}>
            <TextField
                label={label}
                value={value}
                onChange={(ev) => {
                    handleChange(ev.target.value)
                }}
                size="small"
                disabled={disabled}
                variant="outlined"
                fullWidth
            />
        {onChange instanceof Function && <Button label={disabled ? "Unlock": "Lock"} onClick={()=>setDisabled(!disabled)} style={{width: 120}}
            icon={disabled ? <VscUnlock size={20}/> : <VscLock size={20}/>}
            />}
        </div>
}
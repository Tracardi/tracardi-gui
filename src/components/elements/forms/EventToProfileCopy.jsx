import React, {useState} from "react";
import ListOfForms from "./ListOfForms";
import RefInput from "./inputs/RefInput";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const EventToProfileFieldCopy = ({value, onChange}) => {

    const [data, setData] = useState(value || {
        event: {value:"", ref: true},
        profile: {value:"", ref: true},
        op: 0
    })

    const handleDataChange = (key, value) => {
        const _value = {...data, [key]: value}
        setData(_value)
        if (onChange instanceof Function) {
            onChange(_value)
        }
    }

    return <div style={{width: "100%", display: "flex", margin: "5px 0", alignItems: "bottom"}}>

            <RefInput value={data?.profile}
                      autocomplete="profile"
                      fullWidth={true}
                      locked={true}
                      defaultType={true}
                      label="Profile data"
                      onChange={(value) => handleDataChange("profile", value)}
                      style={{width: "100%"}}/>
        <div style={{width: 140}}>
            <TextField
                select
                variant="outlined"
                size="small"
                InputProps={{
                    style: {height: 42}
                }}
                value={data?.op || 0}
                style={{width: 120, marginLeft: 5, marginRight: 5}}
                onChange={(ev) => handleDataChange("op", ev.target.value)}
            >
                <MenuItem value={0} selected>Equals</MenuItem>
                <MenuItem value={1}>Equals if not exists</MenuItem>
                <MenuItem value={2}>Append</MenuItem>
            </TextField>
        </div>
        <RefInput value={data?.event}
                      fullWidth={true}
                      autocomplete="event"
                      locked={true}
                      defaultType={true}
                      label="Event data"
                      onChange={(value) => handleDataChange("event", value)}
                      style={{width: "100%"}}/>

    </div>
}


const EventToProfileCopy = ({value, onChange}) => {
    return <ListOfForms form={EventToProfileFieldCopy}
                        defaultFormValue={{event: {value:"", ref: true}, profile: {value:"", ref: true}, op: 0}}
                        value={value}
                        onChange={onChange}/>
}

export default EventToProfileCopy;
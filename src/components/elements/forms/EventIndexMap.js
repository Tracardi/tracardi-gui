import React, {useState} from "react";
import ListOfForms from "./ListOfForms";
import RefInput from "./inputs/RefInput";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tag from "../misc/Tag";

const EventIndexSetting = ({value, onChange}) => {

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
                  autocomplete="event"
                  filter="traits"
                  fullWidth={true}
                  locked={true}
                  defaultType={true}
                  label="Event trait"
                  onChange={(value) => handleDataChange("event", value)}
                  style={{width: "100%"}}/>

        <div style={{marginLeft: 5, display: "flex", alignItems: "center"}}><Tag backgroundColor="gray" color="white">=</Tag></div>

        <RefInput value={data?.event}
                  fullWidth={true}
                  autocomplete="event"
                  filter="properties"
                  locked={true}
                  defaultType={true}
                  label="Event property"
                  onChange={(value) => handleDataChange("event", value)}
                  style={{width: "100%"}}/>

    </div>
}


const EventIndexMap = ({value, onChange}) => {
    return <ListOfForms form={EventIndexSetting}
                        defaultFormValue={{event: {value:"", ref: true}, profile: {value:"", ref: true}, op: 0}}
                        value={value}
                        onChange={onChange}/>
}

export default EventIndexMap;
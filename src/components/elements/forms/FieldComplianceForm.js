import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import RefInput from "./inputs/RefInput";
import TuiSelectMultiConsentType from "../tui/TuiSelectMultiConsentType";

const FieldComplianceForm = ({value, onChange}) => {

    const [data, setData] = useState(value || {
        field: {value:"", ref: true},
        consents: [],
        action: "hash"
    })

    const handleDataChange = (key, value) => {
        const _value = {...data, [key]: value}
        setData(_value)
        if (onChange instanceof Function) {
            onChange(_value)
        }
    }

    return <div style={{width: "100%", display: "flex", margin: 5, minHeight: 45, alignItems: "center"}}>
        <TextField
            select
            label="Action"
            variant="outlined"
            size="small"
            value={data?.action || "hash"}
            style={{width: 150, marginRight: 5}}
            onChange={(ev) => handleDataChange("action", ev.target.value)}
        >
            <MenuItem value={"erase"} selected>Erase</MenuItem>
            <MenuItem value={"hash"}>Hash</MenuItem>
            <MenuItem value={"nothing"}>Do nothing</MenuItem>
        </TextField>
        <RefInput value={data?.field}
                  fullWidth={false}
                  locked={true}
                  defaultType={true}
                  label="Event property"
                  onChange={(value) => handleDataChange("field", value)}
                  style={{marginRight: 5, width: 425}}/>
        <span style={{padding: 5, width: 80, whiteSpace: "nowrap"}}>IF NOT</span>
        <span style={{width: "100%", marginRight: 5}}><TuiSelectMultiConsentType
            label="Has not consents"
            value={data?.consents}
            fullWidth={true}
            onSetValue={(value)=> handleDataChange("consents", value)}
        /></span>

    </div>
}

export default FieldComplianceForm;
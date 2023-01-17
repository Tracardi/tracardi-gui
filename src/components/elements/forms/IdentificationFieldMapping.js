import React, {useState} from "react";
import ListOfForms from "./ListOfForms";
import RefInput from "./inputs/RefInput";

const IdentificationField = ({value, onChange}) => {

    const [data, setData] = useState(value || {
        event_property: {value:"", ref: true},
        profile_trait: {value:"", ref: true}
    })

    const handleDataChange = (key, value) => {
        const _value = {...data, [key]: value}
        setData(_value)
        if (onChange instanceof Function) {
            onChange(_value)
        }
    }

    return <div style={{width: "100%", display: "flex", margin: "5px 0", alignItems: "center", justifyContent: "space-between"}}>
        <RefInput value={data?.profile_trait}
                  fullWidth={false}
                  locked={true}
                  defaultType={true}
                  label="Profile trait"
                  onChange={(value) => handleDataChange("profile_trait", value)}
                  style={{marginRight: 5, width: "100%"}}/>
        <span style={{padding: 5, width: 80, whiteSpace: "nowrap"}}>EQUALS</span>
        <RefInput value={data?.event_property}
                  fullWidth={false}
                  locked={true}
                  defaultType={true}
                  label="Event property"
                  onChange={(value) => handleDataChange("event_property", value)}
                  style={{marginRight: 5, width: "100%"}}/>
    </div>
}


const IdentificationFieldMapping = ({value, onChange}) => {
    return <ListOfForms form={IdentificationField}
                        defaultFormValue={{event_property: {value:"", ref: true}, profile_trait: {value:"", ref: true}}}
                        value={value}
                        onChange={onChange}/>
}

export default IdentificationFieldMapping;
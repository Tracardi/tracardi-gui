import React, {useState} from "react";
import ListOfForms from "./ListOfForms";
import RefInput from "./inputs/RefInput";

const EventToProfileField = ({value, onChange}) => {

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
                  autocomplete="profile"
                  fullWidth={true}
                  locked={true}
                  defaultType={true}
                  label="Profile"
                  onChange={(value) => handleDataChange("profile_trait", value)}
                  style={{width: "100%"}}/>
        <span style={{margin: "0px 5px 0 5px", padding: "10px 15px", backgroundColor: "#999", color: "white", borderRadius: 10}}>=</span>
        <RefInput value={data?.event_property}
                  fullWidth={true}
                  locked={true}
                  defaultType={true}
                  label="Event property"
                  onChange={(value) => handleDataChange("event_property", value)}
                  style={{width: "100%"}}/>
    </div>
}


const EventToProfileFieldMapping = ({value, onChange}) => {
    return <ListOfForms form={EventToProfileField}
                        defaultFormValue={{event_property: {value:"", ref: true}, profile_trait: {value:"", ref: true}}}
                        value={value}
                        onChange={onChange}/>
}

export default EventToProfileFieldMapping;
import React from "react";
import AutoMultiComplete from "../forms/AutoMultiComplete";


export default function TuiSelectMultiConsentType ({value, label="Consent types", errorMessage=null, onSetValue=null, fullWidth=false}) {

    const handleChange = (v) => {
        if(onSetValue) {
            onSetValue(v)
        }
    }

    return <AutoMultiComplete 
        solo={false}
        disabled={false}
        error={errorMessage}
        placeholder={label}
        url="/consents/type/ids"
        initValue={value}
        onSetValue={handleChange}
        fullWidth={fullWidth}
    />

}
import AutoMultiComplete from "../forms/AutoMultiComplete";
import React from "react";

export default function TuiMultiSelectEventType({value, label="Event types", errorMessage=null, onSetValue=null, fullWidth=false}) {

    const handleChange = (v) => {
        if(onSetValue) {
            onSetValue(v)
        }
    }

    return <AutoMultiComplete
        solo={true}
        disabled={false}
        error={errorMessage}
        placeholder={label}
        url="/events/metadata/type"
        initValue={value}
        onSetValue={handleChange}
        fullWidth={fullWidth}
    />
}
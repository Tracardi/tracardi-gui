import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectFlow({value, disabled=false, errorMessage=null, onSetValue=null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <AutoComplete
        solo={false}
        disabled={disabled}
        placeholder="Flow name"
        url="/flows/entity"
        error={errorMessage}
        initValue={value}
        onSetValue={handleValueSet}
    />
}
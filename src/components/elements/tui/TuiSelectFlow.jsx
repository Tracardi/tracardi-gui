import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectFlow({value, disabled=false, errorMessage=null, onSetValue=null, type=null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={disabled}
        placeholder="Workflow name"
        endpoint={{url:type ? "/flows/entity?type="+type : "/flows/entity"}}
        error={errorMessage}
        initValue={value}
        onSetValue={handleValueSet}
    />
}
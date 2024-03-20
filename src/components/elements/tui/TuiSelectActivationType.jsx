import React from "react";
import AutoComplete from "../forms/AutoComplete";

export function TuiSelectActivationType({initValue, onChange, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Activation type"
        endpoint={{url:"/activation-type"}}
        initValue={initValue}
        onSetValue={onChange}
    />
}
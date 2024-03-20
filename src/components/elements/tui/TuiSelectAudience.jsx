import React from "react";
import AutoComplete from "../forms/AutoComplete";

export function TuiSelectAudience({initValue, onChange, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Audience"
        endpoint={{url:"/audience-list"}}
        initValue={initValue}
        onSetValue={onChange}
    />
}
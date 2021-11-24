import React from "react";
import AutoComplete from "../forms/AutoComplete";

export default function TuiSelectResourceType({value, onSetValue, errorMessage=""}) {
    return <AutoComplete
        solo={false}
        disabled={false}
        error={errorMessage}
        placeholder="Resource type"
        url="/resources/type/name"
        initValue={value}
        onSetValue={onSetValue}
    />
}
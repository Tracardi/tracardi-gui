import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectEventType({value, errorMessage=null, onSetValue=null}) {
    return <AutoComplete
        solo={true}
        disabled={false}
        error={errorMessage}
        placeholder="Event type"
        url="/events/metadata/type"
        initValue={value}
        onSetValue={onSetValue}
    />
}
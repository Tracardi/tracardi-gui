import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectEventType({value, label="Event type", errorMessage=null, onSetValue=null, multiple=false, fullWidth=false}) {
    return <AutoComplete
        solo={true}
        disabled={false}
        error={errorMessage}
        placeholder={label}
        url="/events/metadata/type"
        initValue={value}
        onSetValue={onSetValue}
        multiple={multiple}
        fullWidth={fullWidth}
    />
}
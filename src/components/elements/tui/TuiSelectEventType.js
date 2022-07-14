import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectEventType({value, label="Event type", errorMessage=null, onSetValue=null, multiple=false, fullWidth=false, onlyValueWithOptions=true, defaultValueSet=[]}) {

    const handleChange = (v) => {
        if(onSetValue) {
            onSetValue(v)
        }
    }

    return <AutoComplete
        onlyValueWithOptions={onlyValueWithOptions}
        disabled={false}
        error={errorMessage}
        placeholder={label}
        endpoint={{url:"/events/metadata/type"}}
        initValue={value}
        onSetValue={handleChange}
        multiple={multiple}
        fullWidth={fullWidth}
        onChange={handleChange}
        defaultValueSet={defaultValueSet}
    />
}
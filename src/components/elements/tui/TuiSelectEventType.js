import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectEventType({initValue, value, label="Event type", errorMessage=null, onSetValue=null, multiple=false, fullWidth=false, onlyValueWithOptions=true, defaultValueSet=[]}) {

    const handleChange = (v) => {
        if(onSetValue) {
            onSetValue(v)
        }
    }

    return <AutoComplete
        onlyValueWithOptions={onlyValueWithOptions}
        disabled={false}
        errorMessage={errorMessage}
        placeholder={label}
        endpoint={{url:"/events/metadata/type"}}
        initValue={initValue}
        value={value}
        onSetValue={handleChange}
        multiple={multiple}
        fullWidth={fullWidth}
        onChange={handleChange}
        defaultValueSet={defaultValueSet}
    />
}
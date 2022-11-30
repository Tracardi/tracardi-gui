import AutoComplete from "../forms/AutoComplete";
import React from "react";


export function TuiSelectEventSource({
                                         value = null,
                                         disabled = false,
                                         errorMessage = null,
                                         onSetValue = null,
                                         fullWidth = false,
                                         onlyValueWithOptions = true,
                                         type = null
                                     }) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    const changeProp = onlyValueWithOptions ? {onSetValue: handleValueSet} : {
        onChange: handleValueSet,
        onSetValue: handleValueSet
    };

    const url = (type) => {
        if(type) {
            return "/event-sources/entity?type=" + type
        }
        return "/event-sources/entity"
    }

    return <div>
        <AutoComplete disabled={disabled}
                      onlyValueWithOptions={onlyValueWithOptions}
                      placeholder="Event source"
                      endpoint={{url: url(type)}}
                      initValue={value}
                      error={errorMessage}
                      fullWidth={fullWidth}
                      {...changeProp}
        />
    </div>
}

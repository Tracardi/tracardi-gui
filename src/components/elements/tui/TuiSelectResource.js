import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectResource({value = null, disabled = false, errorMessage = null, onSetValue = null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <AutoComplete disabled={disabled}
                         solo={false}
                         placeholder="Resource"
                         url="/resources/entity"
                         initValue={value}
                         error={errorMessage}
                         onSetValue={handleValueSet}
                         onDataLoaded={
                             (result) => {
                                 if (result) {
                                     let sources = [{id: "", name: ""}]
                                     for (const source of result?.data?.result) {
                                         if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                             sources.push({name: source.name, id: source.id})
                                         }
                                     }
                                     return sources
                                 }
                             }
                         }/>
}
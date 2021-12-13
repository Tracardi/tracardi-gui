import AutoComplete from "../forms/AutoComplete";
import React from "react";


export function TuiSelectEventSource({value = null, disabled = false, errorMessage = null, onSetValue = null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <div>
        <AutoComplete disabled={disabled}
                      solo={false}
                      placeholder="Event source"
                      url="/event-sources/entity"
                      initValue={value}
                      error={errorMessage}
                      onSetValue={handleValueSet}
                      onDataLoaded={
                          (result) => {
                              if (result) {
                                  let sources = []
                                  for (const source of result?.data?.result) {
                                      if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                          sources.push({name: source.name, id: source.id})
                                      }
                                  }
                                  return sources
                              }
                          }
                      }/>
    </div>
}

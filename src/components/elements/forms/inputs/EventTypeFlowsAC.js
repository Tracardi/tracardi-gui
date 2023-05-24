import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {useFetch} from "../../../../remote_api/remoteState";
import {getEventTypeRules} from "../../../../remote_api/endpoints/rule";

export function EventTypeFlowsAC({label, eventType, onSelect, fullWidth=false}) {

    const {data, isLoading, error} = useFetch(
        ["eventTypeRules"],
         getEventTypeRules(eventType),
        data => data
    )

    if(error) {

    }

    return <Autocomplete
        freeSolo={false}
        multiple={false}
        fullWidth={fullWidth}
        options={data?.result || []}
        getOptionLabel={option => option?.flow?.name || null}
        isOptionEqualToValue={(option, value) => option === null || option.flow.id === value.flow.id}
        onChange={(_, value) => {
            if(onSelect instanceof Function) onSelect(value)
        }}
        loading={isLoading}
        renderInput={(params) => (
            <TextField
                {...params}
                label={label || "Flows"}
                variant="outlined"
                size="small"
            />
        )}
    />
}
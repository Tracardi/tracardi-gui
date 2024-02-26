import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {useObjectState} from "../../../../misc/useSyncState";

export default function AudienceFetcherQuery({value, onChange, error}) {

    const {get, update} = useObjectState({
            name: "query",
            value,
            defaultValue: {
                audience_query: ""
            },
            onChange
        }
    )

    return <TextField
        value={get()?.audience_query}
        label="Audience selection"
        size="small"
        error={error}
        helperText={error || ""}
        fullWidth
        onChange={(ev) => update({audience_query: ev.target.value})}
    />
}
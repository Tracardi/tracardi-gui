import React from "react";
import {useObjectState} from "../../../../misc/useSyncState";
import {TuiSelectAudience} from "../../tui/TuiSelectAudience";

export default function AudienceFetcherQuery({value, onChange, error}) {

    const {get, update} = useObjectState({
            name:"AudienceFetcherQuery",
            value,
            defaultValue: {
                audience: {id:"", name:""}
            },
            onChange
        }
    )

    return <TuiSelectAudience
        initValue={get()?.audience}
        errorMessage={error}
        onChange={v => update({audience: v})}
    />
}
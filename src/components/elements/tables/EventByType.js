import {useFetch} from "../../../remote_api/remoteState";
import {getEventByTypeAgg} from "../../../remote_api/endpoints/event";
import PropertyField from "../details/PropertyField";
import React from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export function EventByTypeTable() {
    const {data, isLoading, error} = useFetch(
        ["eventsByTypeAgg", []],
        getEventByTypeAgg(5),
        data => data
    )

    if(isLoading) {
        return  <CenteredCircularProgress />
    }

    return <>
        <PropertyField name="Event name" content="No of events" valueAlign="flex-end"/>
        {data.map((item, index) => {
            return <PropertyField key={`tz-${index}`} name={item.name} content={item.value} valueAlign="flex-end"/>
        })}
        </>
}
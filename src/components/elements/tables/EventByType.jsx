import PropertyField from "../details/PropertyField";
import React from "react";

export function AggregationTable({data}) {
    if(!data) {
        return "No data"
    }
    const result = data.reduce((acc, curr, index) => {
        if (index < 5) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return <>
        <PropertyField name="Event name" content="Count" valueAlign="flex-end"/>
        {result.sort((a, b) => b.value - a.value).map((item, index) => {
            return <PropertyField key={`tz-${index}`} name={item.name} content={item.value} valueAlign="flex-end"/>
        })}
        </>
}
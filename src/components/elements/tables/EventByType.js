import PropertyField from "../details/PropertyField";
import React from "react";

export function AggregationTable({data}) {
    const result = data.reduce((acc, curr, index) => {
        if (index < 5) {
            acc.push(curr);
        } else {
            acc[0].value += curr.value;
        }
        return acc;
    }, [{ name: "other", value: 0 }]);

    return <>
        <PropertyField name="Event name" content="No of events" valueAlign="flex-end"/>
        {result.sort((a, b) => b.value - a.value).map((item, index) => {
            return <PropertyField key={`tz-${index}`} name={item.name} content={item.value} valueAlign="flex-end"/>
        })}
        </>
}
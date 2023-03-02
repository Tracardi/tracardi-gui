import React from "react";

export function StatusPoint({status}) {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }

    return <div
        style={{margin: "0 5px", width: 14, height: 14, borderRadius: 14, backgroundColor: statusColor(status)}}/>
}
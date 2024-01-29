import React from "react";

export function StatusPoint({status, onClick}) {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }

    return <div
        onClick={onClick}
        style={{margin: "0 5px", width: 20, height: 20, borderRadius: 20, backgroundColor: statusColor(status)}}/>
}
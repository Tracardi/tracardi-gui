import React from "react";

export function StatusPoint({status, onClick, size=20}) {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }

    return <div
        onClick={onClick}
        style={{margin: "0 5px", width: size, height: size, borderRadius: size, backgroundColor: statusColor(status)}}/>
}
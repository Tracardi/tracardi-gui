import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function HorizontalCircularProgress({label, size=20, color="inherit"}) {
    return <span style={{display: "flex", alignItems: "center"}}>
        <CircularProgress color={color} size={size}/>
        {label && <div style={{marginLeft: 10}}>{label}</div>}
    </span>
}
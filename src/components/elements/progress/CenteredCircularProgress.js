import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./CenteredCircularProgress.css"

export default function CenteredCircularProgress({size=40, color="secondary", label=null}) {
    return <div className="CenteredCircularProgress">
            <CircularProgress color={color} size={size}/>
            {label && <div style={{marginTop: 5}}>{label}</div>}
        </div>
}
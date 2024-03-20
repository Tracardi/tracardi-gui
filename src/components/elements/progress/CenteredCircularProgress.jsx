import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./CenteredCircularProgress.css"

export default function CenteredCircularProgress({size=40, color="secondary", label=null, minWidth=null}) {
    return <div className="CenteredCircularProgress" style={{minWidth}}>
            <CircularProgress color={color} size={size}/>
            {label && <div style={{marginTop: 5}}>{label}</div>}
        </div>
}
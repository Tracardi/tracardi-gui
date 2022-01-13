import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./CenteredCircularProgress.css"

export default function CenteredCircularProgress({size=40, color="secondary"}) {
    return <div className="CenteredCircularProgress">
            <CircularProgress color={color} size={size}/>
        </div>
}
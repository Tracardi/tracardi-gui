import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./CenteredCircularProgress.css"

export default function CenteredCircularProgress() {
    return <div className="CenteredCircularProgress">
            <CircularProgress color="secondary" />
        </div>
}
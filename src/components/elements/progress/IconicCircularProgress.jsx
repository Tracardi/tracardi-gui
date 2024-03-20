import React from "react";
import "./IconicCircularProgress.css"
import CircularProgress from "@mui/material/CircularProgress";

export default function IconicCircularProgress({icon, size = 40, color = "primary", progress=false}) {
    return <div style={{width: size, height: size}} className="Relative">
        {progress && <div className="Abs">
            <div className="Centered">
                <CircularProgress color={color} size={size}/>
            </div>
        </div>}
        <div className="Abs">
            <div className="Centered">
                {icon}
            </div>
        </div>
    </div>

}
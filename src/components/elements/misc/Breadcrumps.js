import React from "react";
import {useLocation} from "react-router-dom";
import "./Breadcrumps.css";

export default function Breadcrumps() {

    const location = useLocation();

    function getFromPathName() {
        let path = "";
        return location.pathname.split("/").map((label) => {
            if (label !== "") {
                path = path + "/" + label;
                return <span key={label}> &gt; {label}</span>
            } else {
                return <span key={label}>Home</span>
            }
        })
    }

    return <div className="Breadcrumps">
        {getFromPathName()}
    </div>
}
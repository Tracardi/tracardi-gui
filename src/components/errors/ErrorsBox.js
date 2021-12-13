import React from "react";
import "./ErrorsBox.css";
import {VscError} from "@react-icons/all-files/vsc/VscError";

export default function ErrorsBox({errorList, fillWidth}) {

    const visual = (typeof fillWidth === "undefined") ? "ErrorsBox NotFullErrorBox" : "ErrorsBox";

    const displayErrors = (errorLst) => errorLst.map(({msg, loc, type}, index)=>{
        const location = Array.isArray(loc) ? loc.join(".") : "unknown-location"
        return <li key={index} title={location}>{location}: {msg} [{type}]</li>
    })

    const displayBox = (errorLst) => {
        if(errorLst) {
            return <div className={visual}>
                <div style={{width: 40}}><VscError size={40}/></div>
                <div className="ErrorDetails">
                    <div className="Header">The following errors occurred:</div>
                    <ul className="ErrorList">
                        {errorLst && displayErrors(errorLst)}
                    </ul>
                </div>
            </div>
        }
    }

    return displayBox(errorList)
}
import React from "react";
import "./ErrorBox.css";
import {FiAlertTriangle} from "@react-icons/all-files/fi/FiAlertTriangle";

export default function ErrorBox({errorList, fillWidth}) {

    const visual = (typeof fillWidth === "undefined") ? "ErrorBox NotFullErrorBox" : "ErrorBox";

    const displayErrors = (errorLst) => errorLst.map(({msg, loc, type}, index)=>{
        return <li key={index} title={loc}>{msg} [{type}]</li>
    })

    const displayBox = (errorLst) => {
        if(errorLst) {
            return <div className={visual}>
                <FiAlertTriangle size={50}/>
                <section className="ErrorDetails">
                    <div className="Header">The following errors occurred:</div>
                    <ul className="ErrorList">
                        {errorLst && displayErrors(errorLst)}
                    </ul>
                </section>
            </div>
        }
    }

    return displayBox(errorList)
}
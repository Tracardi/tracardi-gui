import React from "react";
import "./ErrorsBox.css";
import {VscError} from "@react-icons/all-files/vsc/VscError";

export default function ErrorsBox({errorList, fillWidth}) {

    const visual = (typeof fillWidth === "undefined") ? "ErrorsBox NotFullErrorBox" : "ErrorsBox";

    const displayErrors = (errorLst) => errorLst.map(({msg, loc, type}, index)=>{
        return <li key={index} title={loc}>{msg} [{type}]</li>
    })

    const displayBox = (errorLst) => {
        if(errorLst) {
            return <div className={visual}>
                <VscError size={50}/>
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
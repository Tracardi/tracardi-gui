import React from "react";
import "./ErrorsBox.css";
import {VscError} from "react-icons/vsc";

export default function ErrorsBox({errorList, fillWidth, style}) {

    const visual = (typeof fillWidth === "undefined") ? "ErrorsBox NotFullErrorBox" : "ErrorsBox";

    const Message = ({location, msg, type}) => {
        if (location) {
            return <>{location}: {msg} [{type}]</>
        }
        return <>{msg} [{type}]</>
    }

    const displayErrors = (errorLst) => {
        if(Array.isArray(errorLst)) {
            return errorLst.map(({msg, loc, type}, index) => {
                const location = Array.isArray(loc) ? loc.join(".") : null
                return <li key={index} title={location}>
                    <Message location={location} msg={msg} type={type}/>
                </li>
            })
        }
    }

    const displayBox = (errorLst) => {
        if (errorLst) {
            return <div className={visual} style={style}>
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
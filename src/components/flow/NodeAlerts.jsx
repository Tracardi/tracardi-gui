import React from "react";
import "./NodeAlerts.css";
import {BsExclamationTriangle,BsExclamationCircle} from "react-icons/bs";

export function ExecutionSeqNumber({data, style}) {

    const hasError = (calls) => {
        if (Array.isArray(calls)) {
            return calls.some((call) => call.error !== null)
        }
        return false
    }

    if (data.debugging?.node?.executionNumber) {
        let status = hasError(data.debugging?.node?.calls) ? " ErrorSequence" : " Ok"
        return <div className={"NodeSequence" + status} style={style}>{data.debugging.node.executionNumber}</div>
    } else {
        return ""
    }
}


export function ErrorNumber({data, style}) {
    if (data.debugging?.node?.errors) {
        return <div className="NodeAlert Error" style={style} title={data.debugging.node.errors + "error reported in error log"}><BsExclamationCircle size={20}/></div>
    } else {
        return ""
    }
}

export function WarningNumber({data, style}) {
    if (data.debugging?.node?.warnings) {
        return <div className="NodeAlert Warning" style={style} title={data.debugging.node.warnings + " warning reported in error log"}><BsExclamationTriangle size={20}/></div>
    } else {
        return ""
    }
}
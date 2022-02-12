import React from "react";
import "./ExecutionNumber.css";

const ExecutionNumber = ({data, style}) => {

    const hasError = (calls) => {
        if (Array.isArray(calls)) {
            return calls.some((call) => call.error !== null)
        }
        return false
    }

    if (data.debugging?.node?.executionNumber) {
        let status = hasError(data.debugging?.node?.calls) ? " Error" : " Ok"
        return <div className={"ExecutionNumber" + status} style={style}>{data.debugging.node.executionNumber}</div>
    } else {
        return ""
    }
}

export default ExecutionNumber;
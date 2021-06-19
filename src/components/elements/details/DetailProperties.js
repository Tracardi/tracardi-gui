import dot from "dot-object";
import DetailKeyValue from "./DetailKeyValue";
import React from "react";

export default function Properties({properties, show}) {

    function empty(obj) {
        return obj  && Object.keys(obj).length === 0 && obj.constructor === Object
    }

    const getValue = (value) => {
        if(typeof value === "undefined") {
            return "undefined";
        } else if(value === null) {
            return "null";
        } else if(empty(value)) {
            return "{}"
        } else if(Array.isArray(value) &&  value.length === 0) {
            return "[]"
        } else {
            return value.toString();
        }
    }

    const dotted = typeof properties !== "undefined" && properties!==null ? dot.dot(properties) : {};
    const keyValues = () => Object.entries(dotted).map(
        ([label, value]) => {
            if(show) {
                if(show.includes(label)) {
                    return <DetailKeyValue key={label} label={label} value={getValue(value)}/>
                } else {
                    return ""
                }
            } else {
                return <DetailKeyValue key={label} label={label} value={getValue(value)}/>
            }
        }
    )
    return <React.Fragment>
        {keyValues()}
    </React.Fragment>
}
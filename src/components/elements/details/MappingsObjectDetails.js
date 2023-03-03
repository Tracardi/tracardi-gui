import dot from "dot-object";
import React from "react";
import PropTypes from "prop-types";
import {isString, startsWith} from "../../../misc/typeChecking";
import AssignValueToKey from "./AssignValueToKey";

export default function MappingsObjectDetails({properties, show, exclude}) {

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
        } if(isString(value) && value === "") {
            return "<empty string>";
        } else if(Array.isArray(value) &&  value.length === 0) {
            return "[]"
        } else {
            return value.toString();
        }
    }

    const dotted = typeof properties !== "undefined" && properties!==null ? dot.dot(properties) : {};
    const keyValues = () => Object.entries(dotted).map(
        ([label, value]) => {

            if(exclude) {
                if(exclude.includes(label) || startsWith(label, exclude)) {
                    return ""
                } else {
                    return <AssignValueToKey key={label} label={label} value={getValue(value)}/>
                }
            }

            if(show) {
                if(show.includes(label)) {
                    return <AssignValueToKey key={label} label={label} value={getValue(value)}/>
                } else {
                    return ""
                }
            }

            return <AssignValueToKey key={label} label={label} value={getValue(value)}/>
        }
    )
    return <>
        {keyValues()}
    </>
}

MappingsObjectDetails.propTypes = {
    properties: PropTypes.object,
    show: PropTypes.array,
  };
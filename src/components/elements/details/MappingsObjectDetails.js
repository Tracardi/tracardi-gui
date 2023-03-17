import React from "react";
import PropTypes from "prop-types";
import {isString, startsWith} from "../../../misc/typeChecking";
import AssignValueToKey from "./AssignValueToKey";

export default function MappingsObjectDetails({properties, show, exclude, keyPrefix, valuePrefix}) {

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

    const keyValues = () => properties.map(
        (item) => {

            const label = item.event?.value
            const value = item.profile?.value
            let op
            switch (item.op) {
                case 0:
                    op = "="
                    break;
                case 1:
                    op = "equals if not exists"
                    break;
                case 2:
                    op = "appends data from"
                    break;
                default:
                    op = "="
            }

            if (exclude) {
                if (exclude.includes(label) || startsWith(label, exclude)) {
                    return ""
                } else {
                    return <AssignValueToKey
                        key={label}
                        label={keyPrefix ? `${keyPrefix}${label}` : label}
                        value={valuePrefix ? `${valuePrefix}${getValue(value)}` : getValue(value)}
                        op={op}
                    />
                }
            }

            if (show) {
                if (show.includes(label)) {
                    return <AssignValueToKey
                        key={label}
                        label={keyPrefix ? `${keyPrefix}${label}` : label}
                        value={valuePrefix ? `${valuePrefix}${getValue(value)}` : getValue(value)}
                        op={op}
                    />
                } else {
                    return ""
                }
            }

            return <AssignValueToKey
                key={label}
                label={keyPrefix ? `${keyPrefix}${label}` : label}
                value={valuePrefix ? `${valuePrefix}${getValue(value)}` : getValue(value)}
                op={op}
            />
        }
    )
    return <>
        {Array.isArray(properties) && keyValues()}
    </>
}

MappingsObjectDetails.propTypes = {
    properties: PropTypes.object,
    show: PropTypes.array,
  };
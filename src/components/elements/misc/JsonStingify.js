import React, {useState} from "react";
import dot from "dot-object";
import "./JsonStringify.css";
import ToggleIcon from "../icons/ToggleIcon";
import {isEmptyObject, isEmptyArray} from "../../../misc/typeChecking";

export default function JsonStringify({data, toggle: taggleValue=false, filterFields=[], disableToggle=false, style={}, disableEmpty=false}) {

    const [toggle, setToggle] = useState(taggleValue);

    function empty(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object
    }

    const getValue = (value) => {
        if (value === null) {
            return "null";
        } else if (empty(value)) {
            return "{}"
        } else if (Array.isArray(value) && value.length === 0) {
            return "[]"
        } else {
            return value.toString();
        }
    }

    const dotted = (data) => {
        return typeof data !== "undefined" && data !== null ? dot.dot(data) : {};
    }

    const row = (index, label, value) => {
        const block = (toggle) ? "block" : "inline-block"
        return <span className="JsonItem" key={index} style={{display: block}}>
                <span className="JsonKey">{label}:</span> <span className="JsonValue">{getValue(value)}</span>,
            </span>
    }


    const highlight = (data, filter, disableEmpty=false) => Object.entries(dotted(data)).map(
        ([label, value], index) => {
            if(disableEmpty && (value === null || isEmptyObject(value) || isEmptyArray(value))) {
                return "";
            }
            if (typeof filter !== "undefined" && Array.isArray(filter)) {
                const startsWith = filter.filter((field) => label.startsWith(field));
                if (startsWith.length === 0) {
                    return row(index, label, value);
                }
                return ""
            } else {
                return row(index, label, value);
            }
        }
    )

    return <div style={{display: "flex", justifyContent: "space-between" , width: "100%", ...style}}>
        <div className="JsonStringify">
            {highlight(data, toggle ? [] : filterFields, disableEmpty)}
        </div>
        {disableToggle === false && <div className="Toggle" onClick={() => setToggle(!toggle)}>
            <ToggleIcon toggle={toggle}/>
        </div>}
    </div>
}

import React from "react";
import dot from "dot-object";
import "./JsonStringify.css";

export default function JsonStringify({data, filter, unfold}) {

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
        const block = (unfold) ? "block" : "inline-block"
        return <span className="JsonItem" key={index} style={{display:block}}>
                <span className="JsonKey">{label}:</span> <span className="JsonValue">{getValue(value)}</span>,
            </span>
    }


    const highlight = (data, filter) => Object.entries(dotted(data)).map(
        ([label, value], index) => {
            if(typeof filter !== "undefined" && Array.isArray(filter)) {
                const startsWith = filter.filter((field) => label.startsWith(field));
                if(startsWith.length === 0) {
                    return row(index, label, value);
                }
                return ""
            } else {
                return row(index, label, value);
            }
        }
    )

    return <div className="JsonStringify">
        {highlight(data, filter)}
    </div>
}

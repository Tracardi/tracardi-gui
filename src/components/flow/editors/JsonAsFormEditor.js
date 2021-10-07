import dot from "dot-object";
import JsonForm from "../../elements/forms/JsonForm";
import React from "react";

export default function JsonAsFormEditor({values, formSchema, onSubmit}) {
    const dotted = (data) => {
        return typeof data !== "undefined" && data !== null ? dot.dot(data) : {};
    }

    const handleSubmit = (dotted) => {
        if(onSubmit) {
            onSubmit(dot.object(dotted))
        }
    }

    return <JsonForm schema={formSchema} values={dotted(values)} onSubmit={handleSubmit}/>
}
import JsonForm from "../../elements/forms/JsonForm";
import React from "react";

export default function JsonAsFormEditor({value, formSchema, onSubmit}) {

    const handleSubmit = (dotted) => {
        if(onSubmit) {
            onSubmit(dotted)
        }
    }

    return <JsonForm schema={formSchema} value={value} onSubmit={handleSubmit}/>
}
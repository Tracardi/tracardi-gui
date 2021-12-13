import {JsonForm} from "./JsonForm";
import React, {useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";

export default function EventSourceConfigForm({schema, onClose}) {

    const [data, setData] = useState(schema?.values || {});
    const [errorMessages, setErrorMessages] = useState(null)

    const handleChange = (value) => {
        setData(MutableMergeRecursive(data, value))
    }

    const handleSubmit = async () => {

        try {
            const response = await asyncRemote({
                baseURL: schema.url,
                url: schema.endpoint,
                method: "POST",
                data: data
            })

            if(onClose instanceof Function) {
                onClose(response.data);
            }

        } catch (e) {
            if(e?.response?.status === 422) {
                setErrorMessages(e.response.data)
            }
            // todo global error
            // setError(getError(e))
        }


    }

    return <JsonForm schema={schema?.form}
                     values={data}
                     errorMessages={errorMessages}
                     onChange={handleChange}
                     onSubmit={handleSubmit}/>
}
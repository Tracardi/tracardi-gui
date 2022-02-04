import {JsonForm} from "./JsonForm";
import React, {useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import { v4 as uuid4 } from "uuid";

export default function TracardiProServiceConfigForm({service, onSubmit}) {

    const [data, setData] = useState({});
    const [errorMessages, setErrorMessages] = useState(null)

    const handleChange = (value) => {
        const newValues = MutableMergeRecursive(data, value)
        setData(newValues)
    }

    const handleSubmit = async () => {

        try {
            const response = await asyncRemote({
                url: '/resource',
                method: "POST",
                data: {
                    id: uuid4(),
                    name: data.name,
                    description: data.description,
                    tags: service?.metadata?.tags,
                    groups:[],
                    type: "scheduler",
                    credentials: {
                        production: data,
                        test: data
                    }
                }
            })

            if (onSubmit instanceof Function) {
                onSubmit(response.data);
            }

        } catch (e) {
            if (e?.response?.status === 422) {
                setErrorMessages(e.response.data)
            }
            // todo global error - when url not available
            // setError(getError(e))
        }


    }

    return <JsonForm schema={service?.form}
                     values={{tags: service?.metadata?.tags}}
                     errorMessages={errorMessages}
                     onChange={handleChange}
                     onSubmit={handleSubmit}/>
}
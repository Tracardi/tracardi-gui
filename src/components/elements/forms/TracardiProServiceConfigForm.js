import {JsonForm} from "./JsonForm";
import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";

export default function TracardiProServiceConfigForm({service, endpoint, onSubmit}) {



    const [data, setData] = useState({});
    const [config, setConfig] = useState(null);
    const [errorMessages, setErrorMessages] = useState(null)

    const path = service?.id ? `/${service?.prefix}/settings/${endpoint.token}?id=${service.id}` : `/${service?.prefix}/settings/${endpoint.token}`;

    useEffect(() => {
        asyncRemote({
            baseURL: endpoint?.url,
            url: path,
            method: "GET"
        }).then((response)=>{
            setConfig(response.data);
            setData(response.data.values);
        }).catch((e)=> {
            // todo global error - when wrong service url
        })
    }, []);

    const handleChange = (value) => {
        setData(MutableMergeRecursive(data, value))
    }

    const handleSubmit = async () => {

        try {
            const response = await asyncRemote({
                baseURL: endpoint?.url,
                url: path,
                method: "POST",
                data: config?.values
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

    return <JsonForm schema={config?.form}
                     values={data}
                     errorMessages={errorMessages}
                     onChange={handleChange}
                     onSubmit={handleSubmit}/>
}
import JsonForm from "../JsonForm";
import React, {useRef, useState} from "react";
import {asyncRemote} from "../../../../remote_api/entrypoint";
import {v4 as uuid4} from "uuid";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../../tui/TuiForm";
import TextField from "@mui/material/TextField";
import TuiTags from "../../tui/TuiTags";
import {isEmptyObject} from "../../../../misc/typeChecking";

function DescriptionForm({data: initData, onChange}) {

    const [data, setData] = useState(initData || {
        name: "",
        description: "",
        tags: []
    });

    const handleChange = (key, value) => {
        const newValue = {[key]: value}
        const newData = {...data, ...newValue}
        setData(newData)
        if (onChange) {
            onChange(newData)
        }
    }

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Service description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Service name" description="Type service name.">
                    <TextField
                        fullWidth
                        label="Name"
                        size="small"
                        value={data?.name}
                        onChange={(ev) => handleChange("name", ev.target.value)}
                        variant="outlined"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Service description" description="Type service name.">
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Description"
                        size="small"
                        value={data?.description}
                        onChange={(ev) => handleChange("description", ev.target.value)}
                        variant="outlined"
                    />
                </TuiFormGroupField>

                <TuiFormGroupField header="System tags"
                                   description="Tags are auto generated and are used for resource filtering.">
                    <TuiTags tags={data?.tags}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default function TracardiProServiceConfigForm({service, onSubmit}) {

    const data = useRef({
        name: "",
        description: "",
        tags: service?.metadata?.tags
    });
    const init = useRef(service?.init);

    const [errorMessages, setErrorMessages] = useState(null)

    const handleChange = (values) => {
        init.current = values
    }

    const handleSubmit = async () => {
        try {
            let payload = {
                id: uuid4(),
                type: service?.metadata?.type,
                name: data.current.name,
                description: data.current.description,
                icon: service?.metadata?.icon,
                tags: data.current.tags,
                groups: [],
                credentials: {
                    production: init.current,
                    test: init.current
                }
            }

            if(service?.destination && !isEmptyObject(service?.destination)) {
                payload.destination = service.destination
            }

            const response = await asyncRemote({
                url: '/tpro/resource',
                method: "POST",
                data: payload
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

    return <div>
        <DescriptionForm data={data.current} onChange={(value) => data.current = value}/>
        <JsonForm schema={service?.form}
                  values={service?.init}
                  errorMessages={errorMessages}
                  onChange={handleChange}
                  onSubmit={handleSubmit}/>
    </div>
}
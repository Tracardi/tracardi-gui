import React, {useState} from "react";
import AutoComplete from "./AutoComplete";
import PasswordInput from "./inputs/PasswordInput";
import {TextInput} from "./JsonFormComponents";

export default function MicroserviceForm({value, onChange, errorMessage}) {

    const [data, setData] = useState(value || {
        url: "http://localhost:8686",
        token: "",
        service: {
            name: "",
            id: ""
        }
    })

    const handleChange = (key, value) => {
        const state = {
            ...data,
            [key]: value
        }

        setData(state)

        if (onChange instanceof Function) {
            onChange(state)
        }
    }

    const handleUrlChange = (value) => {
        console.log(value)
        handleChange("url", value)
    }

    const handleTokenChange = (value) => {
        handleChange("token", value)
    }

    const handleServiceSelect = async (value) => {
        handleChange("service", value)
    }

    return <div>
        <p>Type microservice URL</p>
        <TextInput
            value={data.url}
            label="Tracardi Microservice URL"
            errorMessage={null}
            onChange={handleUrlChange}/>
        <p>Type microservice secret token</p>
        <PasswordInput
            label="Token"
            fullWidth
            value={data.token}
            onChange={(e)=>handleTokenChange(e.target.value)}
        />
        <p>Select service type</p>
        <AutoComplete
            endpoint={{
                baseURL: data.url,
                url: '/services'
            }}
            onlyValueWithOptions={true}
            initValue={null}
            onSetValue={handleServiceSelect}
        />
    </div>
}
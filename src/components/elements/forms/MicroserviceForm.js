import React, {useState} from "react";
import AutoComplete from "./AutoComplete";
import PasswordInput from "./inputs/PasswordInput";
import {TextInput} from "./JsonFormComponents";

export default function MicroserviceForm({value, onChange, errorMessage}) {
    console.log(value)
    const [data, setData] = useState(value || {
        credentials: {
            url: "http://localhost:8686",
            token: ""
        },
        service: {
            name: "",
            id: ""
        }
    })

    const handleChange = (state) => {

        setData(state)

        if (onChange instanceof Function) {
            // Change it to proper object
            onChange(state)
        }
    }

    const handleUrlChange = (value) => {
        const state = {
            ...data,
            credentials: {
                ...data.credentials,
                url: value
            }
        }
        handleChange(state)
    }

    const handleTokenChange = (value) => {
        const state = {
            ...data,
            credentials: {
                ...data.credentials,
                token: value
            }
        }
        handleChange(state)
    }

    const handleServiceSelect = async (value) => {
        const state = {
            ...data,
            service: value
        }
        handleChange(state)
    }

    return <div>
        <p>Type microservice URL</p>
        <TextInput
            value={data?.credentials?.url}
            label="Tracardi Microservice URL"
            errorMessage={null}
            onChange={handleUrlChange}/>
        <p>Type microservice secret token</p>
        <PasswordInput
            label="Token"
            fullWidth
            value={data?.credentials?.token}
            onChange={(e) => handleTokenChange(e.target.value)}
        />
        <p>Select service type</p>
        <AutoComplete
            endpoint={{
                baseURL: data?.credentials?.url,
                url: '/services'
            }}
            onlyValueWithOptions={true}
            initValue={null}
            onSetValue={handleServiceSelect}
        />
    </div>
}
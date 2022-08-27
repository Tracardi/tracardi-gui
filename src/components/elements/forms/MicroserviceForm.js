import React, {useState} from "react";
import AutoComplete from "./AutoComplete";
import PasswordInput from "./inputs/PasswordInput";
import {TextInput} from "./JsonFormComponents";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function MicroserviceForm({value, onServiceChange, onServiceClear}) {

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
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

    const handleUrlChange = (value) => {
        const state = {
            ...data,
            service: {
                name: "",
                id: ""
            },
            credentials: {
                ...data.credentials,
                url: value
            }
        }
        setData(state)

        if (onServiceClear instanceof Function) {
            onServiceClear(state)
        }
    }

    const handleTokenChange = (value) => {
        const state = {
            ...data,
            service: {
                name: "",
                id: ""
            },
            credentials: {
                ...data.credentials,
                token: value
            }
        }
        setData(state)

        if (onServiceClear instanceof Function) {
            onServiceClear(state)
        }
    }

    const handleServiceSelect = async (value) => {
        const state = {
            ...data,
            service: value
        }

        try {
            if(value?.id) {
                try {
                    setLoading(true)
                    const response = await asyncRemote({
                        baseURL: state.credentials.url,
                        url: `/service/resource?service_id=${value.id}`
                    })

                    setData(state)

                    if (onServiceChange instanceof Function) {
                        onServiceChange(state, response?.data)
                    }
                } catch(e) {

                } finally {
                    setLoading(false)
                }
            } else {
                if (onServiceClear instanceof Function) {
                    onServiceClear(state)
                }
            }

        } catch (e) {
            setErrorMessage(e.toString())
        }
    }

    return <div>
        <p>Type microservice URL</p>
        <TextInput
            value={data?.credentials?.url}
            label="Tracardi Microservice URL"
            errorMessage={errorMessage}
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
            value={data?.service}
            onlyValueWithOptions={true}
            initValue={null}
            onSetValue={handleServiceSelect}
        />

        {loading && <div style={{marginTop: 40}}><CenteredCircularProgress label="Loading service configuration form"/></div>}

    </div>
}
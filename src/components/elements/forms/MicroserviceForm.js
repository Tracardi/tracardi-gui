import React, {useState} from "react";
import AutoComplete from "./AutoComplete";
import {TextInput} from "./JsonFormComponents";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";
import TokenInput from "./inputs/TokenInput";

export default function MicroserviceForm({value, onServiceChange, onServiceClear}) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [data, setData] = useState(value || {
        credentials: {
            url: "http://localhost:20000",
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
                    setError(null)
                    const response = await asyncRemote({
                        baseURL: state?.credentials?.url,
                        url: `/service/resource?service_id=${value.id}`
                    },
                        state?.credentials?.token)

                    setData(state)

                    if (onServiceChange instanceof Function) {
                        onServiceChange(state, response?.data)
                    }
                } catch(e) {
                    setError(getError(e))
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
        <p>Type microservice API KEY and generate secret token</p>
        <TokenInput
            label="Api Key"
            token={data?.credentials?.token}
            getTokenUrl={(apiKey) => {
                return {
                    baseURL: data?.credentials?.url,
                    url: "/api-key/" + apiKey
                }
            }}
            onTokenChange={(token) => handleTokenChange(token)}
        />
        <p>Select service type</p>

        <AutoComplete
            endpoint={{
                baseURL: data?.credentials?.url,
                url: '/services'
            }}
            token={data?.credentials?.token}
            value={data?.service}
            onlyValueWithOptions={true}
            initValue={null}
            onSetValue={handleServiceSelect}
        />

        {loading && <div style={{marginTop: 40}}><CenteredCircularProgress label="Loading service configuration form"/></div>}
        {error && <div style={{marginTop: 40}}><ErrorsBox errorList={error}/></div> }
    </div>
}
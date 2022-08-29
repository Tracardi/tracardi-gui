import NodeMicroserviceInfo from "./NodeMicroserviceInfo";
import {MemoNodeInitForm} from "../elements/forms/NodeInitForm";
import React, {useRef, useState} from "react";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import HorizontalCircularProgress from "../elements/progress/HorizontalCircularProgress";
import ErrorsBox from "../errors/ErrorsBox";


export default function NodeMicroserviceForm({node, onMicroserviceChange, onSubmit}) {

    const [refresh, setRefresh] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const mounted = useRef(true);

    const handleInitSubmit = (init) => {
        if(onSubmit instanceof Function) {
            onSubmit(init)
        }
    }

    const handleActionSelect = async ({endpoint, token, actionId, serviceId}) => {

        try {
            setError(null)
            setLoading(true)
            const response = await asyncRemote({
                    baseURL: endpoint.baseURL,
                    url: `/plugin/form?service_id=${serviceId}&action_id=${actionId}`
                },
                token
            )

            node.data.spec = {
                ...node.data.spec,
                init: response.data?.init,
                form: response.data?.form
            }

            if(onMicroserviceChange instanceof Function) {
                onMicroserviceChange()
            }

        } catch (e) {
            if (mounted.current) {
                setError(getError(e))
            }
        } finally {
            if (mounted.current) {
                setLoading(false)
            }
        }

    };

    return <div><NodeMicroserviceInfo
        nodeId={node?.id}
        microservice={node?.data?.spec?.microservice}
        onServiceSelect={(data) => {
            node.data.spec.microservice = {
                ...node.data.spec.microservice,
                server: data
            };
        }}
        onActionSelect={ async (data) => {

            node.data.spec.microservice = {
                ...node.data.spec.microservice,
                plugin: data.plugin
            };

            await handleActionSelect(data)

            setRefresh(refresh+1)

            if(onMicroserviceChange instanceof Function) {
                onMicroserviceChange()
            }
        }}
        onActionClear={() => {
            node.data.spec = {
                ...node.data.spec,
                init: null,
                form: null,
                microservice: {
                    ...node.data.spec.microservice,
                    plugin: {id: "", name: ""}
                }
            }

            setRefresh(refresh+1)

            if(onMicroserviceChange instanceof Function) {
                onMicroserviceChange()
            }
        }}
    />
        {loading && <div style={{display: "flex", justifyContent: "center", height: 60}}><HorizontalCircularProgress label="Loading form"/></div>}
        {!loading && node?.data?.spec?.form && <MemoNodeInitForm
            nodeId={node?.id}
            pluginId={node?.data?.spec?.id}
            microservice={node?.data.spec?.microservice}
            init={node?.data?.spec?.init}
            formSchema={node?.data?.spec?.form}
            onSubmit={handleInitSubmit}
        />}
        {error && <ErrorsBox errorList={error}/> }
    </div>
}
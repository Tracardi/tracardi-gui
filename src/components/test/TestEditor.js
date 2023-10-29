import React, {useState} from "react";
import "./TestEditor.css";
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";
import {getError} from "../../remote_api/entrypoint";
import ResponseForm from "./ResponseFrom";
import Grid from "@mui/material/Grid";
import {useRequest} from "../../remote_api/requestClient";

export default function TestEditor({eventType = 'page-view', sxOnly=false}) {

    const [requestPayload, setRequestPayload] = useState({});
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const {request} = useRequest()

    const handleRequest = async (data) => {
        setRequestPayload(data);
        setLoading(true)
        setErrors(null)
        try {

            const resp = await request({
                url: '/track',
                method: 'post',
                data: data
            })

            if (resp) {
                setResponse(resp)
            }
        } catch (e) {
            setErrors(getError(e))
            setResponse({})
        } finally {
            setLoading(false)
        }
    }

    const handlerError = (e) => {
        setResponse({});
        setErrors(getError(e))
    }

    return <Grid container spacing={2}>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <RequestForm onRequest={handleRequest} onError={handlerError} eventType={eventType}/>
        </Grid>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <ResponseForm loading={loading} response={response} request={requestPayload}/>
        </Grid>
    </Grid>
}
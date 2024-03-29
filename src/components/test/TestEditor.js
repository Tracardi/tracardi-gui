import React, {useState} from "react";
import "./TestEditor.css";
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import ResponseForm from "./ResponseFrom";
import Grid from "@mui/material/Grid";

export default function TestEditor({eventType = 'page-view', sxOnly=false}) {

    const [request, setRequest] = useState({});
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleRequest = async (data) => {
        setRequest(data);
        setLoading(true)
        setErrors(null)
        try {
            const resp = await asyncRemote({
                    url: '/track',
                    method: 'post',
                    data: data
                }
            );

            if (resp) {
                setResponse(resp.data)
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
            <ResponseForm loading={loading} response={response} request={request}/>
        </Grid>
    </Grid>
}
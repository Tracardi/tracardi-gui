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
    const [responseData, setResponseData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const {request} = useRequest()

    const handleRequest = async (data) => {
        setRequestPayload(data);
        setLoading(true)
        setErrors(null)
        try {

            const _data = await request({
                url: '/track',
                method: 'post',
                data: data
            },
                true)

            if (_data) {
                setResponseData(_data)
            }
        } catch (e) {
            setErrors(getError(e))
            setResponseData({})
        } finally {
            setLoading(false)
        }
    }

    const handlerError = (e) => {
        setResponseData({});
        setErrors(getError(e))
    }

    return <Grid container spacing={2}>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <RequestForm onRequest={handleRequest} onError={handlerError} eventType={eventType}/>
        </Grid>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <ResponseForm loading={loading} response={responseData} request={requestPayload}/>
        </Grid>
    </Grid>
}
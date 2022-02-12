import React, {useState} from "react";
import "./TestEditor.css";
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import ResponseForm from "./ResponseFrom";
import ErrorsBox from "../errors/ErrorsBox";

export default function TestEditor({style, eventType = 'page-view'}) {

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

    return <div className="TestEditor" style={style}>
        <div className="LeftColumn">
            <RequestForm onRequest={handleRequest} onError={handlerError} eventType={eventType}/>
        </div>
        <div className="RightColumn">
            {errors && <ErrorsBox errorList={errors}/>}
            <ResponseForm loading={loading} response={response} request={request}/>
        </div>
    </div>
}
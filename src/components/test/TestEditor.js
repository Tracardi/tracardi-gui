import React, {useState} from "react";
import "./TestEditor.css";
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";
import {remote} from "../../remote_api/entrypoint";
import ResponseForm from "./ResponseFrom";

export default function TestEditor() {

    const [request, setRequest] = useState({});
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);

    const handleRequest = async (data) => {
        setRequest(data);
        setLoading(true)
        try {
            const resp = await remote({
                    url: '/track',
                    method: 'post',
                    data: data
                }
            );
            setLoading(false)
            if (resp) {
                setResponse(resp.data)
            }
        } catch (e) {
            console.error(e)
            setResponse({})
        }
    }

    const handlerError = (e) => {
        setResponse({});
        console.error(e)
    }

    return <div className="TestEditor">
        <div className="LeftColumn">
            <RequestForm onRequest={handleRequest} onError={handlerError}/>
        </div>
        <div className="RightColumn">
            <ResponseForm loading={loading} response={response} request={request}/>
        </div>
    </div>
}
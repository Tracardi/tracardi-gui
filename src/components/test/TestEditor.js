import React, {useState} from "react";
import "./TestEditor.css";
import theme from "../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../elements/forms/JsonForm"
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";
import {remote} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";

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
            <form className="JsonForm RequestResponse">
                <div className="JsonFromGroup RequestResponseGroup">
                    <div className="JsonFromGroupHeader">
                        <h2>Request</h2>
                        <p>Request is the data payload that was send to Tracardi for processing.</p>
                    </div>
                    <section style={{overflowY: "auto"}}>
                        <ObjectInspector data={request} theme={theme} expandLevel={3}/>
                    </section>
                </div>
                <div className="JsonFromGroup RequestResponseGroup">
                    <div className="JsonFromGroupHeader">
                        <h2>Response</h2>
                        <p>Response is a data that is send back from Tracardi it may include profile and some debugging information on how the processing of data went.</p>
                    </div>
                    <section style={{overflowY: "auto"}}>
                        {!loading && <ObjectInspector data={response} theme={theme} expandLevel={3}/>}
                        {loading && <CenteredCircularProgress/>}
                    </section>
                </div>
            </form>
        </div>
    </div>
}
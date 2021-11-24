import React, {useState} from "react";
import "./TestEditor.css";
import theme from "../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../elements/forms/JsonForm"
import {RequestForm} from "./RequestForm";
import "./RequestResponse.css";

export default function TestEditor() {

    const [request, setRequest] = useState({});
    const [response, setResponse] = useState({});

    return <div className="TestEditor">
        <div className="LeftColumn">
            <RequestForm onRequest={setRequest} onResponse={setResponse}/>
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
                        <ObjectInspector data={response} theme={theme} expandLevel={3}/>
                    </section>
                </div>
            </form>
        </div>
    </div>
}
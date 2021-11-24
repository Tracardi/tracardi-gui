import React, {useState} from "react";
import "./TestEditor.css";
import theme from "../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import "../elements/forms/JsonForm"
import {RequestForm} from "./RequestForm";

export default function TestEditor() {

    const [request, setRequest] = useState({});
    const [response, setResponse] = useState({});

    return <div className="TestEditor">
        <div className="LeftColumn">
            <RequestForm onRequest={setRequest} onResponse={setResponse}/>
        </div>
        <div className="RightColumn">
            <form className="JsonForm">
                <div className="JsonFromGroup">
                    <div className="JsonFromGroupHeader">
                        <h2>Request data</h2>
                    </div>
                    <section>
                        <ObjectInspector data={request} theme={theme} expandLevel={3}/>
                    </section>
                </div>
            </form>
            <form className="JsonForm">
                <div className="JsonFromGroup">
                    <div className="JsonFromGroupHeader">
                        <h2>Response data</h2>
                    </div>
                    <section>
                        <ObjectInspector data={response} theme={theme} expandLevel={3}/>
                    </section>
                </div>
            </form>
        </div>
    </div>
}
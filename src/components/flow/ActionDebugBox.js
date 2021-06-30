import "./ActionDebugBox.css";
import React from "react";
import DebugBox, {NoData} from "./DebugBox";
import {ObjectInspector} from "react-inspector";

export default function ActionDebugBox({calls}) {

    const renderActions = (calls) => {
        if (calls && Array.isArray(calls)) {
            return calls.map((call, index) => {
                return <div key={index} style={{height: "inherit"}}>
                    <div className="EdgeId">Connection: {call.edge ? call.edge.id : "None"}</div>
                    {call.error && <div className="Errors">{call.error}</div>}
                    {!call.error && <div className="ActionDebugBox">
                        <DebugBox call={call}/>
                        <ObjectInspector data={call} />
                    </div>}
                </div>
            });
        }
        return <NoData/>
    }

    return renderActions(calls)
}
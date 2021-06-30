import {ObjectInspector} from "react-inspector";
import React from "react";
import {NoData} from "./DebugBox";

export function DebugPortDetails({port}) {
    return <>
        <div className="PortName">Port: {port.port}</div>
        <div style={{margin: 5}}>
            {port.value && <ObjectInspector data={port.value} expandLevel={5}/>}
            {!port.value && <NoData/>}
        </div>
    </>
}
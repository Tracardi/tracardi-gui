import React from "react";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import {DebugPortDetails} from "./DebugPortDetails";

export function NoData() {
    return "Port has no data. It means that with provided payload this port will not execute."
}

export default function DebugBox({call}) {

    const renderPorts = (messages) => {
        if (messages) {
            return messages.map((message, index) => {
                return <DebugPortDetails port={message} key={index}/>
            })
        }
    }

    return <>
        <Tabs tabs={["Input", "Output", "Global"]}>
            <TabCase id={0}>
                <div style={{height: 200}}>
                    {call.input && renderPorts([call.input])}
                </div>
            </TabCase>
            <TabCase id={1}>
                {call.output && call.output.length > 0 && renderPorts(call.output)}
            </TabCase>
            <TabCase id={3}>

            </TabCase>
        </Tabs>
    </>
}
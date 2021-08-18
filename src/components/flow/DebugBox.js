import React from "react";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import {DebugPortDetails} from "./DebugPortDetails";
import {NoPortData} from "./NoPortData";
import ConsoleView from "../elements/misc/ConsoleView";

export default function DebugBox({call, onTabSelect}) {

    const renderPorts = (messages, input) => {
        if (messages) {
            return messages.map((message, index) => {
                return <DebugPortDetails port={message} key={index} input={input}/>
            })
        } else {
            return <NoPortData input={input}/>
        }
    }

    const Padder = ({children}) => {
        return <div style={{height: "calc(100% - 40px)"}}>
            {children}
        </div>
    }

    return <div style={{height: "calc(100% - 45px)"}}>
        {call.error && <div className="Errors">{call.error}</div>}
        {!call.error && <Tabs
            tabs={["Input", "Output", "Profile"]}
            onTabSelect={onTabSelect}
        >
            <TabCase id={0}>
                <Padder>
                    {renderPorts([call?.input?.params], true)}
                </Padder>
            </TabCase>
            <TabCase id={1}>
                <Padder>
                    {renderPorts(call?.output?.results, false)}
                </Padder>
            </TabCase>
            <TabCase id={2}>
                <Padder>
                    <ConsoleView data={call?.profile} label="Profile"/>
                </Padder>
            </TabCase>
        </Tabs>}
    </div>
}
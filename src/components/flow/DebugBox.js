import React from "react";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import {DebugPortDetails} from "./DebugPortDetails";
import {NoPortData} from "./NoPortData";
import ConsoleView from "../elements/misc/ConsoleView";
import ErrorBox from "../errors/ErrorBox";

export default function DebugBox({call, onTabSelect}) {
    const renderPorts = (messages, input) => {
        if (messages) {
            return messages.map((result, index) => {
                return <DebugPortDetails port={result} key={index} input={input}/>
            })
        } else {
            return <NoPortData input={input}/>
        }
    }

    const Padder = ({children}) => {
        return <div>
            {children}
        </div>
    }

    return <>
        {call?.error && <ErrorBox>{call.error}</ErrorBox>}
        {!call?.error && <Tabs
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
    </>
}
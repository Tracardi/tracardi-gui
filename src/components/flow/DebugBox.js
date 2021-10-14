import React from "react";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import {DebugPortDetails} from "./DebugPortDetails";
import {NoPortData} from "./NoPortData";
import ErrorBox from "../errors/ErrorBox";
import DebugContextAccordions from "./accordions/DebugContextAccordion";
import "./DebugBox.css";

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

    return <div className="DebugBox">
        {call?.error && <ErrorBox>{call.error}</ErrorBox>}
        {!call?.error && <Tabs
            tabs={["Input", "Output", "Debug data"]}
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
                    <DebugContextAccordions profile={call?.profile} event={call?.event}/>
                </Padder>
            </TabCase>
        </Tabs>}
    </div>
}
import React from "react";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import ErrorBox from "../errors/ErrorBox";
import DebugContextAccordions from "./accordions/DebugContextAccordion";
import "./DebugBox.css";
import AccordionItems from "./accordions/AccordionItems";
import theme from "../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";

export default function DebugBox({call, onTabSelect}) {

    const PortsAccordion = ({portsData}) => {
        if(Array.isArray(portsData)) {
            const accordionItems = portsData.map((item, idx) => {
                return {
                    id:"item"+idx,
                    title: `Port: ${item.port}`,
                    description: `Click to see content of port "${item.port}"`,
                    content: <ObjectInspector data={item.value} theme={theme} expandLevel={5}/>
                }
            })
            return <AccordionItems items={accordionItems} />
        }
        // No data
        return ""

    }

    const Padder = ({children, style}) => {
        return <div style={style}>
            {children}
        </div>
    }

    return <div className="DebugBox">
        {call?.error && <ErrorBox>{call.error}</ErrorBox>}
        {!call?.error && <Tabs
            tabs={["Input", "Output", "Debug data"]}
            onTabSelect={onTabSelect}
            className="DebugTabs"
        >
            <TabCase id={0}>
                <Padder>
                    <PortsAccordion portsData={[call?.input?.params]} />
                </Padder>
            </TabCase>
            <TabCase id={1}>
                <Padder>
                    <PortsAccordion portsData={call?.output?.results} />
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
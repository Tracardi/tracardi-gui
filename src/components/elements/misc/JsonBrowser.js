import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import React, {useState} from "react";
import 'react-json-pretty/themes/monikai.css';
import JSONPretty from "react-json-pretty";
import Tabs, {TabCase} from "../tabs/Tabs";
import JsonStringify from "./JsonStingify";

export default function JsonBrowser({data, tab: defaultTab = 1}) {
    const [tab, setTab] = useState(defaultTab)
    return <>
        <Tabs
            tabs={["Tree", "Raw", "Flat"]}
            defaultTab={tab}
            onTabSelect={setTab}
        >

            <TabCase id={0}>
                <div style={{padding: 20}}>
                    <ObjectInspector data={data} theme={theme} expandLevel={5}/>
                </div>

            </TabCase>

            <TabCase id={1}>
                <div style={{padding: 20}}>
                    <JSONPretty data={data} style={{fontSize: 13}}
                                mainStyle="background-color:white; margin: 0;color: rgb(187, 187, 187);"
                                keyStyle="color: #444"
                                valueStyle="color: rgb(0, 170, 0)"
                                stringStyle="color: rgb(0, 105, 192); white-space: normal"
                    />
                </div>
            </TabCase>
            <TabCase id={2}>
                <div style={{padding: 20}}>
                    <JsonStringify data={data} toggle={true}/>
                </div>
            </TabCase>

        </Tabs>
    </>
}
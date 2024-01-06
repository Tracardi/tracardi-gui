import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import React, {useState} from "react";
import 'react-json-pretty/themes/monikai.css';
import JSONPretty from "react-json-pretty";
import Tabs, {TabCase} from "../tabs/Tabs";
import JsonStringify from "./JsonStingify";
import useTheme from "@mui/material/styles/useTheme";

export default function JsonBrowser({data, tab: defaultTab = 1}) {
    const [tab, setTab] = useState(defaultTab)
    const _theme = useTheme()

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
                                mainStyle={`background-color:transparent; margin: 0; color: ${_theme.palette.text.primary};`}
                                keyStyle={`color: ${_theme.palette.text.secondary}`}
                                valueStyle={`color: ${_theme.palette.primary.main}`}
                                stringStyle={`color: ${_theme.palette.secondary.main}; white-space: normal`}
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
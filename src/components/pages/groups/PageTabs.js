import React, {useState} from "react";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PageTabs.css";
import {objectMap} from "../../../misc/mappers";

export default function PageTabs({title, tabs = {}}) {

    const [tab, setTab] = useState(0);
    let i = -1;

    return <div className="PageTabs">
        <h1 className="Title">{title}</h1>
        <div>
            <Tabs
                tabs={Object.keys(tabs)}
                defaultTab={tab}
                onTabSelect={setTab}
                tabStyle={{flex: "initial"}}
                tabsStyle={{paddingLeft: 30, backgroundColor: "aliceblue"}}
            >
                {objectMap(tabs, (key, component) => {
                    i = i + 1;
                    return <TabCase id={i} key={key}>
                        <div style={{paddingTop: 10, backgroundColor: "white"}}>
                            {component}
                        </div>
                    </TabCase>
                })}
            </Tabs>
        </div>
    </div>
}
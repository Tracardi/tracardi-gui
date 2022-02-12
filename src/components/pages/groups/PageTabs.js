import React, {useState} from "react";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PageTabs.css";
import {objectMap} from "../../../misc/mappers";
import NeedHelpButton from "../../elements/misc/NeedHelpButton";

export default function PageTabs({title, tabs = {}}) {

    const [tab, setTab] = useState(0);
    let i = -1;

    return <div className="PageTabs" style={{height: "initial"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <h1 className="Title">{title}</h1>
            <NeedHelpButton/>
        </div>


            <Tabs
                className="TabNav"
                tabs={Object.keys(tabs)}
                defaultTab={tab}
                onTabSelect={setTab}
                tabStyle={{flex: "initial"}}
                tabContentStyle={{overflow: "initial"}}
                tabsStyle={{paddingLeft: 30, backgroundColor: "#e1f5fe", borderBottom: "solid 1px #b3e5fc"}}
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
}
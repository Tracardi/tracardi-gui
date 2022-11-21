import React, {useState} from "react";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PageTabs.css";
import PrivateTab from "../../authentication/PrivateTab";

export default function PageTabs({tabs = {}}) {

    const filteredTabs = tabs.filter((tab) => tab instanceof PrivateTab && tab.isAuth())

    const [tab, setTab] = useState(0);
    let i = -1;

    return <div className="PageTabs">
        <Tabs
            className="TabNav"
            tabs={filteredTabs.map(tab => tab.label)}
            defaultTab={tab}
            onTabSelect={setTab}
            tabStyle={{flex: "initial"}}
            tabContentStyle={{overflow: "initial"}}
            tabsStyle={{paddingLeft: 30}}
        >
            {filteredTabs.map((tab, key) => {
                i = i + 1;
                return <TabCase id={i} key={key}>
                    <div style={{paddingTop: 10, height: "inherit", borderRadius: "inherit"}}>
                        {tab.component}
                    </div>
                </TabCase>
            })}
        </Tabs>
    </div>
}
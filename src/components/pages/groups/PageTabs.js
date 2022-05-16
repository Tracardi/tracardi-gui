import React, {useState} from "react";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PageTabs.css";
import NeedHelpButton from "../../elements/misc/NeedHelpButton";
import PrivateTab from "../../authentication/PrivateTab";
import {getApiUrl, resetApiUrlConfig} from "../../../remote_api/entrypoint";
import ReadOnlyInput from "../../elements/forms/ReadOnlyInput";
import {logout} from "../../authentication/login";
import SponsorButton from "../../elements/misc/SponsorButton";

export default function PageTabs({title, tabs = {}}) {

    const filteredTabs = tabs.filter((tab) => tab instanceof PrivateTab && tab.isAuth())

    const [tab, setTab] = useState(0);
    let i = -1;

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        logout()
        window.location.reload()
    }

    return <div className="PageTabs">
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <h1 className="Title">{title}</h1>
            <span className="Info">
                <SponsorButton/>
                <ReadOnlyInput label="Tracardi API"
                               value={getApiUrl()}
                               onReset={handleEndpointReset}/>
                               <NeedHelpButton/>
            </span>

        </div>

        <Tabs
            className="TabNav"
            tabs={filteredTabs.map(tab => tab.label)}
            defaultTab={tab}
            onTabSelect={setTab}
            tabStyle={{flex: "initial"}}
            tabContentStyle={{overflow: "initial"}}
            tabsStyle={{paddingLeft: 30, backgroundColor: "#e1f5fe", borderBottom: "solid 1px #b3e5fc"}}
        >
            {filteredTabs.map((tab, key) => {
                i = i + 1;
                return <TabCase id={i} key={key}>
                    <div style={{paddingTop: 10, backgroundColor: "white", height: "inherit"}}>
                        {tab.component}
                    </div>
                </TabCase>
            })}
        </Tabs>
    </div>
}
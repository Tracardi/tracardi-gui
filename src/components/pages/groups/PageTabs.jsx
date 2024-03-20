import React, {useContext, useState} from "react";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PageTabs.css";
import PrivateTab from "../../authentication/PrivateTab";
import useTheme from "@mui/material/styles/useTheme";
import {useLocation} from "react-router";
import {KeyCloakContext} from "../../context/KeyCloakContext";

export default function PageTabs({tabs = {}}) {

    const authContext = useContext(KeyCloakContext)
    const location = useLocation();
    const theme = useTheme()

    const filteredTabs = tabs.filter((tab) => tab instanceof PrivateTab && tab.isAuth(authContext?.state?.roles))

    let defaultTab = 0
    if(location?.hash) {
        defaultTab = filteredTabs.map(e => e.hash).indexOf(location.hash);
    }

    const [tab, setTab] = useState(defaultTab);
    let i = -1;

    const style = {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.common.black
    }

    return <div className="PageTabs" style={style}>
        <Tabs
            tabs={filteredTabs.map(tab => tab.label)}
            defaultTab={tab}
            onTabSelect={setTab}
            tabStyle={{flex: "initial", paddingLeft: 20}}
            tabContentStyle={{overflow: "initial"}}
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
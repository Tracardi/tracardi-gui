import Tabs, {TabCase} from "../elements/tabs/Tabs";
import React from "react";
import './SidebarRight.css';

const SidebarRight = ({defaultTab, onTabSelect, debugTab, inspectTab, logTab}) => {
    return <aside className="SidebarRight">
        <Tabs
            tabs={["Inspector", "Debugger", "Logs"]}
            defaultTab={defaultTab}
            onTabSelect={onTabSelect}
        >
            <TabCase id={0}>
                {inspectTab}
            </TabCase>
            <TabCase id={1}>
                <div style={{height: "inherit"}}>
                    {debugTab}
                </div>
            </TabCase>
            <TabCase id={2}>
                {logTab}
            </TabCase>
        </Tabs>
    </aside>
}

export default SidebarRight;

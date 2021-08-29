import Tabs, {TabCase} from "../elements/tabs/Tabs";
import React from "react";
import './SidebarRight.css';

const SidebarRight = ({defaultTab, onTabSelect, debugTab, inspectTab}) => {
    return <aside className="SidebarRight">
        <Tabs
            tabs={["Inspect", "Debugging", "Logs"]}
            defaultTab={defaultTab}
            onTabSelect={onTabSelect}
        >
            <TabCase id={0}>
                {inspectTab}
            </TabCase>
            <TabCase id={1}>
                {debugTab}
            </TabCase>
            <TabCase id={2}>
                None
            </TabCase>
        </Tabs>
    </aside>
}

export default SidebarRight;

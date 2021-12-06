import Tabs, {TabCase} from "../elements/tabs/Tabs";
import React from "react";
import './SidebarRight.css';

const SidebarRight = ({defaultTab, onTabSelect, inspectTab, logTab}) => {
    return <aside className="SidebarRight">
        <Tabs
            tabs={["Inspector","Logs"]}
            defaultTab={defaultTab}
            onTabSelect={onTabSelect}
        >
            <TabCase id={0}>
                {inspectTab}
            </TabCase>
            <TabCase id={1}>
                {logTab}
            </TabCase>
        </Tabs>
    </aside>
}

export default SidebarRight;

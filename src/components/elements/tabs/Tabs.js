import React, {useState} from "react";
import "./Tabs.css";
import PropTypes from 'prop-types';

export function TabCases({children, tabId}) {
    return React.Children.map(children,
        (child) => {
            if (tabId === child.props.id) {
                return child;
            }
            return "";
        }
    );
}

export function TabCase({children, id}) {
    return children;
}

TabCases.propTypes = {
    tabId: PropTypes.number.isRequired,
}
TabCase.propTypes = {
    id: PropTypes.number.isRequired,
}

export default function Tabs({tabs, children, defaultTab, onTabSelect}) {

    const [tabId, setTabId] = useState((defaultTab) ? defaultTab : 0);
    const onTabClick = (id) => {
        setTabId(id);
        if(onTabSelect) {
            onTabSelect(id);
        }
    }

    function Tab({label, index, selected}) {
        return <span className={(selected) ? "Tab Selected" : "Tab"} onClick={() => onTabClick(index)}>{label}</span>
    }

    return <nav className="Tabs">
        <nav className="Navigation">
            {tabs.map((label, key) => {
                    if (tabId === key) {
                        return <Tab label={label} key={key} index={key} selected={true}/>
                    }
                    return <Tab label={label} key={key} index={key} selected={false}/>
                }
            )}
        </nav>
        <div className="TabContent">
            <TabCases tabId={tabId}>
                {children}
            </TabCases>
        </div>
    </nav>

}
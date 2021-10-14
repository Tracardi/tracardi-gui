import React, {useEffect, useState} from "react";
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
TabCases.propTypes = {
    tabId: PropTypes.number.isRequired,
}

export function TabCase({children, id}) {
    return children;
}
TabCase.propTypes = {
    id: PropTypes.number.isRequired,
}

export default function Tabs({tabs, children, defaultTab=0, onTabSelect, className}) {

    const [tabId, setTabId] = useState((defaultTab) ? defaultTab : 0);

    useEffect(() => {
        setTabId((defaultTab))
    }, [defaultTab])

    const onTabClick = (id) => {
        setTabId(id);
        if(onTabSelect) {
            onTabSelect(id);
        }
    }

    function Tab({label, index, selected}) {
        return <span className={(selected) ? "Tab Selected" : "Tab"} onClick={() => onTabClick(index)}>{label}</span>
    }

    const css = () => {
        if(className) {
            return "Navigation "+className;
        }
        return "Navigation";
    }

    return <section className="Tabs">
        <nav className={css()}>
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
    </section>

}
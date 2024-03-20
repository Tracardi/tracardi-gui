import React, {useEffect, useState} from "react";
import "./Tabs.css";
import PropTypes from 'prop-types';
import useTheme from "@mui/material/styles/useTheme";

export function TabCases({children, tabId}) {
    return React.Children.map(children,
        (child) => {
            if (tabId === child?.props?.id) {
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

export default function Tabs({tabs, children, defaultTab = 0, onTabSelect, className, tabStyle, tabsStyle, tabContentStyle}) {

    const theme = useTheme()
    const [tabId, setTabId] = useState((defaultTab) ? defaultTab : 0);

    useEffect(() => {
        setTabId((defaultTab))
    }, [defaultTab])

    const onTabClick = (id) => {
        setTabId(id);
        if (onTabSelect) {
            onTabSelect(id);
        }
    }

    function Tab({label, index, selected, style}) {

        if(selected) {
            style = {...style, borderBottom: `solid 3px ${theme.palette.primary.main}`}
        }

        return <span className={"Tab"}
                     style={style}
                     onClick={() => onTabClick(index)}>{label}</span>
    }

    const css = () => {
        if (className) {
            return "Navigation " + className;
        }
        return "Navigation";
    }

    return <section className="Tabs" style={tabsStyle}>
        <nav className={css()} style={{...tabStyle, backgroundColor: theme.palette.common.white}}>
            {tabs.map((label, key) => {
                    if (tabId === key) {
                        return <Tab label={label}
                                    key={key}
                                    index={key}
                                    selected={true}
                                    style={tabStyle}
                        />
                    }
                    return <Tab label={label}
                                key={key}
                                index={key}
                                style={tabStyle}
                                selected={false}/>
                }
            )}
        </nav>
        <div className="TabContent" style={tabContentStyle}>
            <TabCases tabId={tabId}>
                {children}
            </TabCases>
        </div>
    </section>

}
import {FaSafari, FaChrome, FaFirefox, FaOpera, FaEdge} from "react-icons/fa";
import React from "react";
import {FaRobot} from "react-icons/fa";
import {capitalizeString} from "../EventTypeTag";

export default function BrowserLabel({browser, version = null, robot = false}) {
    const browsers = {
        "chrome": <FaChrome size={20} style={{marginRight: 5}}/>,
        "safari": <FaSafari size={20} style={{marginRight: 5}}/>,
        "firefox": <FaFirefox size={20} style={{marginRight: 5}}/>,
        "edge": <FaEdge size={20} style={{marginRight: 5}}/>,
        "opera": <FaOpera size={20} style={{marginRight: 5}}/>
    }
    const _browser = browser.toLowerCase()
    if (_browser in browsers) {
        return <>{browsers[_browser]} {capitalizeString(browser)} <span style={{marginLeft: 5}}>{version && `v.${version}`}</span> {robot &&
        <FaRobot size={20} style={{marginLeft: 10}}/>} </>
    }

    return browser
}
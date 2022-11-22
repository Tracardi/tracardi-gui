import {FaSafari, FaChrome, FaFirefox, FaOpera, FaEdge} from "react-icons/fa";
import React from "react";

export default function BrowserLabel({browser}) {
    const browsers = {
        "chrome": <FaChrome size={20} style={{marginRight: 5}}/>,
        "safari": <FaSafari size={20} style={{marginRight: 5}}/>,
        "firefox": <FaFirefox size={20} style={{marginRight: 5}}/>,
        "edge": <FaEdge size={20} style={{marginRight: 5}}/>,
        "opera": <FaOpera size={20} style={{marginRight: 5}}/>
    }
    if (browser in browsers) {
        return <>{browsers[browser]} {browser}</>
    }

    return browser
}
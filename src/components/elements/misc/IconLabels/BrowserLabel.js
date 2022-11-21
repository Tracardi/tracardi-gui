import {FaSafari, FaChrome, FaFirefox, FaInternetExplorer} from "react-icons/fa";
import React from "react";

export default function BrowserLabel({browser}) {
    const borwsers = {
        "chrome": <FaChrome size={20} style={{marginRight: 5}}/>,
        "safari": <FaSafari size={20} style={{marginRight: 5}}/>,
        "firefox": <FaFirefox size={20} style={{marginRight: 5}}/>,
        "internetexplorer": <FaInternetExplorer size={20} style={{marginRight: 5}}/>
    }
    if (browser in borwsers) {
        return <>{borwsers[browser]} {browser}</>
    }

    return browser
}
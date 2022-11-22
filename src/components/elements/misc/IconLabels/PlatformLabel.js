import {BsApple, BsWindows, BsPhone} from "react-icons/bs";
import {VscTerminalLinux} from "react-icons/vsc";
import React from "react";

export default function PlatformIcon({platform}) {
    const platforms = {
        "Win32": <BsWindows size={20} style={{marginRight: 5}}/>,
        "MacIntel": <BsApple size={20} style={{marginRight: 5}}/>,
        "Linux x86_64": <VscTerminalLinux size={20} style={{marginRight: 5}}/>,
        "iPhone": <BsPhone size={20} style={{marginRight: 5}}/>
    }
    if (platform in platforms) {
        return <>{platforms[platform]} {platform}</>
    }

    return platform
}
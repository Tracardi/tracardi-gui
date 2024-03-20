import {BsApple, BsWindows, BsPhone} from "react-icons/bs";
import {VscTerminalLinux} from "react-icons/vsc";
import React from "react";

export default function PlatformIcon({platform, os}) {
    const platforms = {
        "Windows": <BsWindows size={20} style={{marginRight: 5}}/>,
        "Win32": <BsWindows size={20} style={{marginRight: 5}}/>,
        "MacIntel": <BsApple size={20} style={{marginRight: 5}}/>,
        "MacOS": <BsApple size={20} style={{marginRight: 5}}/>,
        "Linux x86_64": <VscTerminalLinux size={20} style={{marginRight: 5}}/>,
        "Linux armv8l": <VscTerminalLinux size={20} style={{marginRight: 5}}/>,
        "Linux aarch64": <VscTerminalLinux size={20} style={{marginRight: 5}}/>,
        "Ubuntu": <VscTerminalLinux size={20} style={{marginRight: 5}}/>,
        "iPhone": <BsPhone size={20} style={{marginRight: 5}}/>,
        "Android 4.1": <BsPhone size={20} style={{marginRight: 5}}/>,
        "Android": <BsPhone size={20} style={{marginRight: 5}}/>,
    }
    if (platform in platforms) {
        return <>{platforms[platform]} {os} {platform} </>
    }

    return <>{os} {platform}</>
}
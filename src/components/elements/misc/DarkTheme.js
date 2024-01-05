import {BsMoon} from "react-icons/bs";
import React, {useState} from "react";
import IconButton from "./IconButton";

export default function DarkThemeButton({onDarkMode}) {

    const [darkMode, setDarkMode] = useState(false)

    const handleModeChange  = () => {
        const mode = !darkMode
        setDarkMode(mode)
        if(onDarkMode instanceof Function) {
            onDarkMode(mode)
        }
    }

    return <IconButton label="Need help?" selected={darkMode} onClick={handleModeChange}><BsMoon size={20}/></IconButton>
}
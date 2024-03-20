import {BsMoon} from "react-icons/bs";
import React from "react";
import IconButton from "./IconButton";
import useTheme from "@mui/material/styles/useTheme";

export default function DarkThemeButton({onDarkMode}) {

    const theme = useTheme();

    const handleModeChange  = () => {
        const mode = theme.palette.mode === 'dark' ? 'light' : 'dark'

        if(onDarkMode instanceof Function) {
            onDarkMode(mode === 'dark')
        }
    }

    return <IconButton label="Need help?" selected={theme.palette.mode === 'dark'} onClick={handleModeChange}><BsMoon size={20}/></IconButton>
}
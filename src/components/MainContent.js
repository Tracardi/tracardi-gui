import React from "react";
import "./MainContent.css";
import MainMenu from "./menu/MainMenu";
import useTheme from "@mui/material/styles/useTheme";

export default function MainContent({children, style, onContextChange}) {
    const theme = useTheme();
    style= {...style, backgroundColor: theme.palette.background.default}

    return <div className="MainContent" style={style}>
        <MainMenu onContextChange={onContextChange}/>
        <div className="MainPane" id="MainWindowScroll">
            {children}
        </div>
    </div>
}
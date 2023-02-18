import React from "react";
import "./MainContent.css";
import MainMenu from "./menu/MainMenu";

export default function MainContent({children, style, onContextChange}) {
    return <div className="MainContent" style={style}>
        <MainMenu onContextChange={onContextChange}/>
        <div className="MainPane" id="MainWindowScroll">
            {children}
        </div>
    </div>
}
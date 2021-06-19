import React from "react";
import MainMenuFiller from "./MainMenuFiller";
import "./MainMenu.css";

export default function MainMenu({children}) {
    return <div className="MainMenu">
        <MainMenuFiller height="45px"/>
        {children}
        <MainMenuFiller height="100%"/>
    </div>
}
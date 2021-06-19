import React from "react";
import "./MainMenuItem.css";
import {useHistory, useLocation} from "react-router-dom";

export default function MainMenuItem({icon, title, link, defaultLink}) {
    const location = useLocation();
    const history = useHistory();

    let itemClass = "MainMenuItem";
    if(typeof defaultLink !== "undefined" && defaultLink === location.pathname) {
        itemClass = itemClass + " MainMenuSelectedItem";
    } else if (location.pathname.substring(0, link.length) === link) {
        itemClass = itemClass + " MainMenuSelectedItem"
    } else {
        itemClass = itemClass + " MainMenuNotSelectedItem"
    }

    const onClick = () => {
        history.push(link);
    }

    return <div className={itemClass} onClick={onClick}>
        <div>{icon}</div>
        <div>{title}</div>
    </div>
}
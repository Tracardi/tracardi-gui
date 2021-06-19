import React from "react";
import "./SubMenuItem.css";
import {useHistory, useLocation} from "react-router-dom";

export default function SubMenuItem({children, link, defaultLink}) {
    const location = useLocation();
    const history = useHistory();

    let itemClass = "SubMenuItem";
    if(typeof defaultLink !== "undefined" && defaultLink.includes(location.pathname)) {
        itemClass = itemClass + " SubMenuSelectedItem";
    } else if(location.pathname === link) {
        itemClass = itemClass + " SubMenuSelectedItem";
    } else {
        itemClass = itemClass + " SubMenuNotSelectedItem";
    }

    const onClick = () => {
        history.push(link);
    }

    return <div className={itemClass} onClick={onClick}>
        {children}
    </div>
}
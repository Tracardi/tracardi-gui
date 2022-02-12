import React from "react";
import './SidebarRight.css';

const SidebarRight = ({children}) => {
    return <aside className="SidebarRight">
        {children}
    </aside>
}

export default SidebarRight;

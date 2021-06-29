import React from "react";
import {Menu, MenuButton} from "@szhsin/react-menu";

export function MenuIcon({icon, label, children}) {
    return <Menu menuButton={<MenuButton title={label}>{icon}</MenuButton>}
                 arrow={true}
                 align="center"
                 direction={"right"}
                 offsetX={10}
                 boundingBoxPadding="10px"
                >
        {children}
    </Menu>
}
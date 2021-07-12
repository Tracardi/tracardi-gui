import React from "react";
import {Menu, MenuButton} from "@szhsin/react-menu";

export function MenuIcon({icon, label, children, direction="right"}) {
    return <Menu menuButton={<MenuButton title={label}>{icon}</MenuButton>}
                 arrow={true}
                 align="center"
                 direction={direction}
                 offsetX={10}
                 boundingBoxPadding="10px"
                >
        {children}
    </Menu>
}
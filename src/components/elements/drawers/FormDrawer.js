import RightPaperHeader from "../RightPaperHeader";
import Drawer from "@material-ui/core/Drawer";
import React from "react";

export default function FormDrawer(
    {
        width,
        label,
        open,
        onClose,
        children
    }) {

    return <Drawer anchor="right" open={open} onClose={onClose}>
        <div style={{width: (width) ? width : 1200, overflowX: "hidden"}}>
            <RightPaperHeader onClose={onClose}>
                <span style={{fontWeight: 600}}>{label}</span>
            </RightPaperHeader>
            {open && children}
        </div>
    </Drawer>
}

import Drawer from "@mui/material/Drawer";
import React from "react";
import PropTypes from 'prop-types';

export default function FormDrawer(
    {
        width,
        open,
        onClose,
        children,
        anchor="right"
    }) {

    return <Drawer anchor={anchor}
                   open={open}
                   onClose={onClose}
                   PaperProps={{
                       sx: {
                           borderRadius: "15px",
                           margin: "10px",
                           height: "calc(100% - 20px)"
                       }
                   }}
    >
        <div style={{width: (width) ? width : 1200, overflowX: "hidden", height:"inherit"}}>
            {open && children}
        </div>
    </Drawer>
}

FormDrawer.propTypes = {
    width: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func
};

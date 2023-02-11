import Drawer from "@mui/material/Drawer";
import React from "react";
import PropTypes from 'prop-types';

export default function FormDrawer(
    {
        width,
        open,
        onClose,
        children,
        anchor="right",
        backdrop=true,
        variant="temporary"
    }) {

    return <Drawer anchor={anchor}
                   hideBackdrop={!backdrop}
                   open={open}
                   onClose={onClose}
                   variant={variant}
                   PaperProps={{
                       sx: {
                           borderRadius: "15px",
                           margin: "10px",
                           height: "calc(100% - 20px)"
                       }
                   }}
    >
        <div style={{width: (width) ? width : 1200, overflowX: "hidden", height:"100%"}}>
            {open && children}
        </div>
    </Drawer>
}

FormDrawer.propTypes = {
    width: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func
};

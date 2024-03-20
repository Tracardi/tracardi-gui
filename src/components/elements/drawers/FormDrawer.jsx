import Drawer from "@mui/material/Drawer";
import React from "react";
import PropTypes from 'prop-types';
import {v4 as uuid4} from 'uuid';

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

    let style={width: (width) ? width : 1200, overflowX: "hidden", height: "inherit"}

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
        <div style={style}>
            {open && <div key={uuid4()}>{children}</div>}
        </div>
    </Drawer>
}

FormDrawer.propTypes = {
    width: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func
};

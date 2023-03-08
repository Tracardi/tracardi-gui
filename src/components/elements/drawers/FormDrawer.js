import Drawer from "@mui/material/Drawer";
import React, {useContext} from "react";
import PropTypes from 'prop-types';
import {LocalDataContext} from "../../pages/DataAnalytics";

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

    const localContext = useContext(LocalDataContext)

    let style={width: (width) ? width : 1200, overflowX: "hidden", height:"100%"}

    if(localContext) {
        // Production
        style = {...style, border: "solid 3px rgb(173, 20, 87)", borderRadius: "inherit"}
    }

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
            {open && children}
        </div>
    </Drawer>
}

FormDrawer.propTypes = {
    width: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func
};

import Drawer from "@material-ui/core/Drawer";
import React from "react";
import PropTypes from 'prop-types';
import RuleForm from "../forms/RuleForm";

export default function RuleFormDrawer(
    {
        init,
        width,
        open,
        onClose
    }) {

    return <Drawer anchor="right" open={open} onClose={onClose}>
        <div style={{width: (width) ? width : 1200, overflowX: "hidden"}}>
            {open && <RuleForm init={init} onReady={onClose}/>}
        </div>
    </Drawer>
}

RuleFormDrawer.propTypes = {
        init: PropTypes.object,
        label: PropTypes.string,
        open: PropTypes.bool,
        onClose: PropTypes.func
  };

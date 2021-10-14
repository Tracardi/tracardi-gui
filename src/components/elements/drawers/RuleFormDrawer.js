import RightPaperHeader from "../RightPaperHeader";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import RuleAddForm from "../forms/RuleAddForm";
import PropTypes from 'prop-types';

export default function RuleFormDrawer(
    {
        init,
        width,
        label,
        open,
        onClose
    }) {

    const onRuleClose = (ev) => {
        onClose(ev);
    }

    return <Drawer anchor="right" open={open} onClose={onRuleClose}>
        <div style={{width: (width) ? width : 1200, overflowX: "hidden"}}>
            <RightPaperHeader onClose={onRuleClose}>
                <span style={{fontWeight: 600}}>{label}</span>
            </RightPaperHeader>
            {open && <RuleAddForm init={init}/>}
        </div>
    </Drawer>
}

RuleFormDrawer.propTypes = {
        init: PropTypes.object,
        label: PropTypes.string,
        open: PropTypes.bool,
        onClose: PropTypes.func
  };

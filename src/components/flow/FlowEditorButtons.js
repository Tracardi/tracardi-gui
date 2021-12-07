import {VscDebugAlt} from "@react-icons/all-files/vsc/VscDebugAlt";
import React, {useState} from "react";
import './FlowEditorButtons.css'
import Popover from "@material-ui/core/Popover";
import ModuleRegisterForm from "./ModuleRegisterForm";
import {VscAdd} from "@react-icons/all-files/vsc/VscAdd";
import IconButton from "../elements/misc/IconButton";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";

export function FlowEditorIcons({onEdit, onDebug, onRegister, debugInProgress}) {

    const [showResisterPopOver, setShowResisterPopOver] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const onRegisterClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShowResisterPopOver(true);
    }

    const handlePopoverClose = () => {
        setShowResisterPopOver(false);
        setAnchorEl(null);
        onRegister(null);
    };

    return <div className="FlowEditorButtons">
        <IconButton label="Add plugin" onClick={onRegisterClick}>
            <VscPlug size={24}/>
        </IconButton>
        <IconButton label="Debug"
                    onClick={onDebug}
                    progress={debugInProgress}>
            <VscDebugAlt size={20}/>
        </IconButton>
        <Popover
            id="register"
            open={showResisterPopOver}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <ModuleRegisterForm onReady={handlePopoverClose}/>
        </Popover>
    </div>
}
import {FiEdit3} from "@react-icons/all-files/fi/FiEdit3";
import {VscDebugAlt} from "@react-icons/all-files/vsc/VscDebugAlt";
import React, {useState} from "react";
import './FlowEditorButtons.css'
import Popover from "@material-ui/core/Popover";
import ModuleRegisterForm from "./ModuleRegisterForm";
import {VscAdd} from "@react-icons/all-files/vsc/VscAdd";
import IconButton from "../elements/misc/IconButton";
import {VscZoomIn} from "@react-icons/all-files/vsc/VscZoomIn";
import {VscZoomOut} from "@react-icons/all-files/vsc/VscZoomOut";
import {useZoomPanHelper} from "react-flow-renderer";

export function FlowEditorIcons({onEdit, onDebug, onRegister, debugInProgress}) {

    const [showResisterPopOver, setShowResisterPopOver] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { zoomIn, zoomOut } = useZoomPanHelper();

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
        <IconButton label="Zoom in" onClick={zoomIn}>
            <VscZoomIn size={40} className="CircleIcon"/>
        </IconButton>
        <IconButton label="Zoom out" onClick={zoomOut}>
            <VscZoomOut size={40} className="CircleIcon"/>
        </IconButton>
        <IconButton label="Add plugin" onClick={onRegisterClick}>
            <VscAdd size={40} className="CircleIcon"/>
        </IconButton>

        <IconButton label="Edit" onClick={onEdit}>
            <FiEdit3 size={40} className="CircleIcon"/>
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
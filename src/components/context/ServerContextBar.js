import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, {useState} from "react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {objectMapEntries} from "../../misc/mappers";
import DropDownMenu from "../menu/DropDownMenu";
import FormDrawer from "../elements/drawers/FormDrawer";

function Extensions({extensions}) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerExtension, setDrawerExtension] = useState(null);

    const handleClose = () => {
        setOpenDrawer(false)
    }

    const extensionOptions = extensions ? objectMapEntries(extensions, (key) => {
        return () => {
            setDrawerExtension(key)
            setOpenDrawer(true)
        }
    }) : null

    if (extensions === null) {
        return ""
    }

    return <>

        {extensionOptions && <div className="flexLine" style={{marginLeft: 5, height: 33}}>
            <DropDownMenu icon={<BsThreeDotsVertical size={18} style={{height: 21}}/>}
                          progress={false}
                          options={extensionOptions}/>
        </div>}
        <FormDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} width={800}>
            {drawerExtension in extensions && React.createElement(extensions[drawerExtension], {onClose: handleClose})}
        </FormDrawer>
    </>
}

export default function ServerContextBar({context, extensions, onContextChange}) {

    const style = context
        ? {background: "rgb(173, 20, 87)", color: "white"}
        : {}

    return <>
        <ToggleButtonGroup
            color="primary"
            value={context ? "production" : "test"}
            exclusive
            onChange={onContextChange}
        >
            <ToggleButton value="test" size="small">Test</ToggleButton>
            <ToggleButton value="production" size="small" style={style}>Production</ToggleButton>

        </ToggleButtonGroup>
        {extensions && <Extensions extensions={extensions}/> }
    </>
}
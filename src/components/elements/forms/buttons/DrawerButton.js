import React, {useState} from "react";
import Popover from "@mui/material/Popover";
import Button from "../Button";
import Paper from "@mui/material/Paper";
import Drawer from "@mui/material/Drawer";

export default function DrawerButton({children, label, icon, variant = "outlined", anchor="right"}) {

    const [selected, setSelected] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDisplay = (event) => {
        setAnchorEl(event.currentTarget);
        setSelected(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelected(false)
    };


    const open = Boolean(anchorEl);
    const id = open ? 'datetime-popover' : undefined;

    return <div>
        <Button
            icon={icon}
            style={
                {
                    margin: 0,
                    marginLeft: 5
                }
            }
            label={label}
            onClick={handleDisplay}
            variant={variant}
            size="small"
            selected={selected}
        />
        <Drawer
            id={id}
            open={open}
            anchor={anchor}
            onClose={handleClose}
        >
            {children}
        </Drawer>
    </div>

}

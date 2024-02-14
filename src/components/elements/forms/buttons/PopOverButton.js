import React, {useState} from "react";
import Popover from "@mui/material/Popover";
import Button from "../Button";
import Paper from "@mui/material/Paper";

export default function PopOverButton({children, label, icon, variant = "outlined"}) {

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
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <Paper>
                {children}
            </Paper>

        </Popover>
    </div>

}

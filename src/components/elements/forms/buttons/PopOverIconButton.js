import React, {useState} from "react";
import Popover from "@mui/material/Popover";
import IconButton from "../../misc/IconButton";

export default function PopOverIconButton({
                                              children, label, icon, style,
                                              anchor = {
                                                  vertical: 'bottom',
                                                  horizontal: 'right',
                                              },
                                              transform = {
                                                  vertical: 'top',
                                                  horizontal: 'right',
                                              }
                                          }) {

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

    const addPropToChildren = (children, additionalProps) => {
        return React.Children.map(children, child => {
            // Make sure to not add props to text nodes or boolean values
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {...additionalProps});
            }
            return child;
        });
    };

    return <>
        <IconButton
            icon={icon}
            style={style}
            label={label}
            onClick={handleDisplay}
            selected={selected}
        >{icon}</IconButton>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchor}
            transformOrigin={transform}
        >
            {addPropToChildren(children, {onClose: handleClose})}
        </Popover>
    </>

}

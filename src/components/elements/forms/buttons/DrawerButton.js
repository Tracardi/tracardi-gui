import React, {useState} from "react";
import Button from "../Button";
import FormDrawer from "../../drawers/FormDrawer";

export default function DrawerButton({children, size, width=500, label, icon, variant = "outlined", anchor="right", onClick}) {

    const [selected, setSelected] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDisplay = (event) => {
        let result = true
        if(onClick instanceof Function) {
            result = onClick()
        }
        if(result === true) {
            setAnchorEl(event.currentTarget);
            setSelected(true)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelected(false)
    };


    const open = Boolean(anchorEl);
    const id = open ? 'datetime-popover' : undefined;

    return <>
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
            size={size}
            selected={selected}
        />
        <FormDrawer
            id={id}
            width={width}
            open={open}
            anchor={anchor}
            onClose={handleClose}
        >
            {children}
        </FormDrawer>
    </>

}

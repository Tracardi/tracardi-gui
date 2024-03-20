import React, {useState} from "react";
import Popover from "@mui/material/Popover";
import Button from "../Button";

export default function PopOverButton({children, label, icon, style, variant = "outlined", size='standard'}) {

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
                return React.cloneElement(child, { ...additionalProps });
            }
            return child;
        });
    };

    return <div>
        <Button
            icon={icon}
            style={style}
            label={label}
            onClick={handleDisplay}
            variant={variant}
            size={size}
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
          {addPropToChildren(children, {onClose: handleClose})}
        </Popover>
    </div>

}

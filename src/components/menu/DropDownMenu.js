import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from "../elements/forms/Button";
import {objectMap} from "../../misc/mappers";


export default function DropDownMenu({label, icon, options, progress=false, selected=false, width}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, handleClick) => {
        setAnchorEl(null);
        handleClick()
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <Button
                icon={icon}
                label={label}
                onClick={handleClickListItem}
                progress={progress}
                selected={selected}
                style={width && {width: width}}
            />

            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                {options && objectMap(options, (label, handleClick) => (
                    <MenuItem
                        key={label}
                        onClick={(event) => handleMenuItemClick(event, handleClick)}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
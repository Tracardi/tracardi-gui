import React, {useState} from "react";
import "./DateTimePicker.css";
import {IoRefresh} from "react-icons/io5";
import useTheme from "@mui/material/styles/useTheme";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";

export default function RefreshSelector({value=0, onChange}) {

    const theme = useTheme()

    const [selected, setSelected] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [refreshRate, setRefreshRate] = useState(value);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setSelected(true)
    };

    const handleChange = (event) => {
        setRefreshRate(event.target.value)
        setAnchorEl(null);
        setSelected(false)
        if(onChange instanceof Function){
            onChange(event.target.value)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelected(false)
    };

    return <>
        <Button
            id="refresh-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            style={{color: (selected || refreshRate > 0) ? "white" : theme.palette.primary.main,
                backgroundColor: (selected || refreshRate > 0) ? theme.palette.primary.main : "transparent"}}
        >
            <IoRefresh size={24} style={{marginRight: 5}}/>{refreshRate} sec
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'refresh-button',
            }}>
            <MenuItem value={0} selected onClick={handleChange}>No refresh</MenuItem>
            <MenuItem value={5} onClick={handleChange}>5 seconds</MenuItem>
            <MenuItem value={15} onClick={handleChange}>15 seconds</MenuItem>
            <MenuItem value={30} onClick={handleChange}>30 seconds</MenuItem>
            <MenuItem value={60} onClick={handleChange}>1 minute</MenuItem>
        </Menu>
    </>


}

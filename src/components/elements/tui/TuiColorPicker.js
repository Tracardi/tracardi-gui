import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import {BsPalette} from "react-icons/bs";
import Popover from "@mui/material/Popover";
import Fade from "@mui/material/Fade";
import ColorPicker from "react-best-gradient-color-picker";
import InputAdornment from "@mui/material/InputAdornment";

export default function TuiColorPicker({value=null, label="color", onChange,style}) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [color, setColor] = useState(value || 'white');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (value) => {
        setColor(value);
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'picker-popover' : undefined;


    return <div style={{display: "flex", ...style}}>
        <TextField label={label}
                   value={color}
                   variant="outlined"
                   size="small"
                   disabled={true}
                   fullWidth
                   InputProps={{
                       startAdornment: <InputAdornment position="start" onClick={handleClick} style={{cursor: "pointer"}}>
                           <BsPalette size={20}/>
                       </InputAdornment>
                   }}
        />
        <div style={{
            width: 38,
            height: 38,
            background: color,
            borderRadius: 12,
            marginLeft: 5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} onClick={handleClick}>

        </div>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            TransitionComponent={Fade}
            style={{
                marginTop: 5
            }}
        >
            <div style={{
                padding: 10
            }}>
                <ColorPicker value={color} onChange={handleSelect}/>
            </div>

        </Popover>
    </div>

}
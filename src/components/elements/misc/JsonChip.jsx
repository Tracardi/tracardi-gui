import {Chip} from "@mui/material";
import React from "react";
import Popover from "@mui/material/Popover";
import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import Box from "@mui/material/Box";

export default function JsonChip({label, object={}}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const id = open ? 'json-chip-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return <span><Chip label={label} onClick={handleClick} style={{marginRight: 5}}></Chip>
        <Popover
            id={id}
            open={open}
            onClose={()=>setAnchorEl(null)}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}

        >
            <Box component="div" sx={{p: 2}}>
                <ObjectInspector data={object} theme={theme} expandLevel={5}/>
            </Box>
        </Popover>
    </span>
}
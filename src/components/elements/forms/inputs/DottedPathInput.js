import React, {useState} from "react";
import {isString} from "../../../../misc/typeChecking";
import TextField from "@material-ui/core/TextField";
import "./DottedInputPath.css";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import {BsArrowBarRight} from "@react-icons/all-files/bs/BsArrowBarRight";
import {IoTextOutline} from "@react-icons/all-files/io5/IoTextOutline";


export default function DottedPathInput({value, onChange, forceMode, error = false, helperText = null, width=460}) {

    let computedMode;
    if(forceMode) {
        computedMode = forceMode;
    } else {
        const re = new RegExp("^(payload|profile|session|event|flow)@");
        computedMode = re.test(value) ? 1 : 2;
    }

    let [sourceValue, pathValue] = isString(value) ? value.split('@') : ["", ""];
    const [mode, setMode] = useState(computedMode);

    if (typeof pathValue === 'undefined' && sourceValue) {
        pathValue = sourceValue
        sourceValue = ''
    }

    const [path, setPath] = React.useState(pathValue || "");
    const [source, setSource] = React.useState(sourceValue || "");

    const sources = [
        {
            value: '',
            label: '',
        },
        {
            value: 'payload',
            label: 'payload',
        },
        {
            value: 'profile',
            label: 'profile',
        },
        {
            value: 'event',
            label: 'event',
        },
        {
            value: 'session',
            label: 'session',
        },
        {
            value: 'flow',
            label: 'flow',
        },
    ];

    const handleExternalOnChange = (mode, path, source) => {
        if (onChange) {
            if(mode === 1) {
                onChange(`${source}@${path}`)
            } else {
                onChange(path)
            }
        }
    }

    const handleModeChange = (mode) => {
        handleExternalOnChange(mode, path, source);
        setMode(mode);
    }

    const handlePathChange = (event) => {
        setPath(event.target.value);
        handleExternalOnChange(mode, event.target.value, source);
        event.preventDefault();
    };

    const handleSourceChange = (event) => {
        setSource(event.target.value);
        handleExternalOnChange(mode, path, event.target.value);
        event.preventDefault();
    };

    const Separator = () => {

        const [displayPopover, setDisplayPopover] = useState(false);
        const [anchorEl, setAnchorEl] = useState(null);

        const selectedIcon = (mode === 1)
            ? <BsArrowBarRight size={26} />
            : <IoTextOutline size={26} />

        const handlePopoverDisplay = (event) => {
            if(typeof forceMode === 'undefined') {
                setAnchorEl(event.currentTarget);
                setDisplayPopover(!displayPopover)
            }
        }

        return <>
            <span onClick={handlePopoverDisplay} style={{margin: "8px 5px 5px", cursor: "pointer"}}>{selectedIcon}</span>
            <Popover
                    open={displayPopover}
                    anchorEl={anchorEl}
                    onClose={()=>setDisplayPopover(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className="DottedInputSeparatorPo">
                    <div className="Item" onClick={()=>{handleModeChange(1)}}><BsArrowBarRight size={20} style={{marginRight: 15}}/> Path to data</div>
                    <div className="Item" onClick={()=>{handleModeChange(2)}}><IoTextOutline size={20} style={{marginRight: 15}}/> Plain text</div>
                </div>
            </Popover></>
    }

    const pathMode = () => <div className="DottedInputPath">
        <TextField select
                   label="Source"
                   variant="outlined"
                   size="small"
                   value={source}
                   onChange={handleSourceChange}
                   style={{width: 120}}
        >
            {sources.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
        <Separator/>
        <TextField label="Path"
                   value={path}
                   onChange={handlePathChange}
                   variant="outlined"
                   size="small"
                   style={{width: width}}
                   error={error}
                   helperText={helperText}
        />
    </div>

    const valueMode = () => <div className="DottedInputPath">
        <Separator/>
        <TextField label="Text"
                   value={path}
                   onChange={handlePathChange}
                   variant="outlined"
                   size="small"
                   style={{width: width + 120}}
                   error={error}
                   helperText={helperText}
        />
    </div>

    return mode === 1 ? pathMode() : valueMode();
}
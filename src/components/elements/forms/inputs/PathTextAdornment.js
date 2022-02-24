import React, {useState} from "react";
import {IoTextOutline, IoAt} from "react-icons/io5";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

export default function PathTextAdornment({value, onChange, lock=false, lockValue=null}) {

    const sources = [
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

    const [path, setPath] = useState(value !== "");
    const [source, setSource] = useState(value || "");

    const handleIconClick = () => {
        const newValue = !path
        setPath(newValue)
        if(newValue === false) {
            setSource("");
            if (onChange) {
                onChange("")
            }
        } else {
            if (onChange) {
                onChange(source)
            }
        }

    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    const handleSourceChange = (event) => {
        const source = event.target.value;
        setSource(source)
        if (onChange) {
            onChange(source)
        }
    }

    function values() {
        if(lock === true && lockValue) {
            return <MenuItem value={lockValue}>
                {lockValue}
            </MenuItem>
        }

        return sources.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))
    }

    const Path = () => {
        return <div style={{display: "flex", alignItems: "center"}}>
            <TextField select
                       variant="standard"
                       size="small"
                       value={source}
                       onChange={handleSourceChange}
                       style={{width: 120}}
                       onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation()
                       }}
            >
                {values()}
            </TextField>
            <IoAt size={24} title="Path to value" style={{color: "gray", margin: "0 5px"}}/>
        </div>
    }

    return <span
        style={{display: "flex", alignItems: "center", cursor: "pointer"}}
        onClick={handleIconClick}
        onMouseDown={handleMouseDown}
    >
        {path ? <Path/> : <IoTextOutline size={20} title="Value" style={{color: "gray", marginRight: 10}}/>}
    </span>
}
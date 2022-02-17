import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React from "react";
import FlowNodeIcons from "../../../flow/FlowNodeIcons";

export default function DestinationInput({value, onChange}) {

    const destinations = [
        {
            name: "RabbitMQ",
            icon: "rabbitmq",
            package: "module1",
        }
    ]

    const handleOnChange = (ev) => {
        if(onChange) {
            onChange(ev.target.value)
        }
    }

    return <TextField
        select
        variant="outlined"
        size="small"
        value={value || {}}
        style={{width: 150}}
        onChange={handleOnChange}
    >
        {destinations.map((item) => {
            return <MenuItem value={item.package} key={item.package}>
                <div style={{display: "flex", alignItems:"center"}}><FlowNodeIcons icon={item.icon} /> <span style={{marginLeft: 10}}>{item.name}</span></div>
            </MenuItem>
        })}
    </TextField>

}
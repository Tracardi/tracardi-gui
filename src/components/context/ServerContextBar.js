import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";

export default function ServerContextBar({context, onContextChange}) {

    const style = context
        ? {background: "rgb(173, 20, 87)", color: "white"}
        : {}

    return <ToggleButtonGroup
        color="primary"
        value={context ? "production" : "development"}
        exclusive
        onChange={onContextChange}
    >
        <ToggleButton value="development" size="small">Development</ToggleButton>
        <ToggleButton value="production" size="small" style={style}>Production</ToggleButton>
    </ToggleButtonGroup>
}
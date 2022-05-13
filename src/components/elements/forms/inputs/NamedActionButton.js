import Button from "../Button";
import React, {useRef} from "react";
import TextField from "@mui/material/TextField";

export default function NamedActionButton({textLabel, buttonLabel, onClick, progress, confirmed, disabled = false, icon}) {

    const name = useRef("");

    const handleClick = () => {
        if (onClick instanceof Function) {
            onClick(name.current)
        }
    };
    return <span style={{display: "flex"}}>
        <TextField variant="outlined"
                   size="small"
                   disabled={disabled}
                   label={textLabel}
                   onChange={(e) => name.current = e.target.value}
        />
        <Button
            label={buttonLabel}
            onClick={handleClick}
            progress={progress}
            disabled={disabled}
            confirmed={confirmed}
            icon={icon}
        />
    </span>
}
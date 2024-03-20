import React from "react";
import "./Button.css";
import PropTypes from 'prop-types';
import {Button as MuiButton} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Button({label, onClick, className, style, icon, disabled, size="middle", selected = false, progress = false, confirmed = false, error = false, variant="outlined"}) {

    let color = "primary"
    if (error) {
        color = "error"
    } else if (confirmed) {
        color = "success"
    }

    if (selected) {
        variant = "contained"
    }

    return <MuiButton disabled={disabled}
                      variant={variant}
                      onClick={onClick}
                      color={color}
                      startIcon={progress ? <CircularProgress size={20} color={"secondary"}/> : icon}
                      style={{margin: 1, ...style}}
                      className={className}
                      size={size}
    >   
        {label}
    </MuiButton>

}

Button.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.object,
    style: PropTypes.object,
    icon: PropTypes.element,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    progress: PropTypes.bool
}
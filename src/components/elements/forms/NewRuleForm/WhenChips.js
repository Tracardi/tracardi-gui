import Chip from "@mui/material/Chip";
import React from "react";
import {VscError} from "react-icons/vsc";
import {BsCheckCircle} from "react-icons/bs";
import PropTypes from 'prop-types';

const WhenChips = ({condition, onDelete}) => {

    if(condition === "") {
        return <Chip
            icon={<VscError size={24} color={"#d81b60"}/>}
            label="No condition set yet"
            style={{color:"#d81b60", border: "solid #d81b60 2px", backgroundColor: "inherit"}}/>
    }
    return <Chip
        icon={<BsCheckCircle size={24} color={"#0069c0"}/>}
        label={condition}
        style={{color:"#0069c0", border: "solid #0069c0 2px", backgroundColor: "inherit"}}
        onDelete={onDelete}
    />
}

WhenChips.propTypes = {
    condition: PropTypes.string,
    onDelete: PropTypes.string
}

export default WhenChips;
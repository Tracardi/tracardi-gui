import {VscWarning} from "react-icons/vsc";
import React from "react";

const Warning = ({message}) => {
    return <>
        <VscWarning style={{color: "#c2185b", marginLeft: 10, marginRight: 5}} size={20} title="Incompatible backend version ."/> <span style={{color: "#c2185b"}}>{message}</span>
    </>
}

export default Warning;
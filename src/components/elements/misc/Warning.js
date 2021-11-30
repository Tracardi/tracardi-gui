import {VscWarning} from "@react-icons/all-files/vsc/VscWarning";
import React from "react";

const Warning = ({message}) => {
    return <>
        <VscWarning style={{color: "red", marginLeft: 10, marginRight: 10}} size={25} title="Incompatible backend version ."/> {message}
    </>
}

export default Warning;
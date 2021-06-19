import {CgPlayButtonO} from "@react-icons/all-files/cg/CgPlayButtonO";
import {CgPlayStopO} from "@react-icons/all-files/cg/CgPlayStopO";
import React from "react";

const EnabledIcon = ({enabled, style}) => {

    if(!style) {
        style = {}
    }

    return (enabled) ?
        <CgPlayButtonO size={25} style={{...style, color: "darkgreen"}}/> :
        <CgPlayStopO size={25} style={{...style, color: "darkred"}}/>
}

export default React.memo(EnabledIcon);

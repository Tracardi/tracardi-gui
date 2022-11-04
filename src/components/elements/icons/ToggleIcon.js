import {BsArrowsCollapse, BsArrowsExpand} from "react-icons/bs";
import React from "react";

const ToggleIcon = ({toggle, size=30}) => {
    return (toggle) ? <BsArrowsCollapse size={size}/> : <BsArrowsExpand size={size}/>;
}

export default ToggleIcon;
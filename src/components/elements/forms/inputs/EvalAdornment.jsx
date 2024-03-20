import {AiOutlineFunction} from "react-icons/ai";
import React from "react";
import {BsInputCursorText} from "react-icons/bs";

export default function EvalAdornment({value, onChange}) {

    const handleClick = () => {
        if (onChange) {
            onChange(!value)
        }
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    return <span
        style={{display: "flex", alignItems: "center", cursor: "pointer"}}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
    >
        {value === true ? <AiOutlineFunction size={20} title="Auto cast value function"/> :
            <BsInputCursorText size={20} title="Data"/>}
    </span>
}
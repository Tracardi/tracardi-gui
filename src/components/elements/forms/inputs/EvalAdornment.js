import {HiOutlineVariable} from "react-icons/hi";
import React, {useState} from "react";
import {BsInputCursorText} from "react-icons/bs";

export default function EvalAdornment({value, onChange}) {

    const [showEval, setShowEval] = useState(value || false);

    const handleClickShowPassword = () => {
        const newValue = !showEval
        setShowEval(newValue)
        if(onChange) {
            onChange(newValue)
        }
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return <span
                    style={{display: "flex", alignItems: "center", cursor: "pointer"}}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showEval ? <HiOutlineVariable size={20} title="Evaluate expresion"/> : <BsInputCursorText size={20} title="Data"/>}
                </span>
}
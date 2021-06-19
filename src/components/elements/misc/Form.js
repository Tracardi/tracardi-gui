import React from "react";
import "./Form.css";

export default function Form({children, style}) {
    return <form className="Form" style={style}>
        {children}
    </form>
}
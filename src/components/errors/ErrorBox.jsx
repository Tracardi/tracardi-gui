import React from "react";
import "./ErrorBox.css";
import {VscError} from "react-icons/vsc";

export default function ErrorBox({children, style}) {

    return <div className="ErrorBox" style={style}>
        <VscError size={25} style={{minWidth: 25}}/>
        <div className="ErrorDetails">
            {children}
        </div>
    </div>

}
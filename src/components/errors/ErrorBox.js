import React from "react";
import "./ErrorBox.css";
import {VscError} from "react-icons/vsc";

export default function ErrorBox({children}) {

    return <div className="ErrorBox">
        <div>
            <VscError size={25}/>
        </div>
        <div className="ErrorDetails">
            {children}
        </div>
    </div>

}
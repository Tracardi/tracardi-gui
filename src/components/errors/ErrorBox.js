import React from "react";
import "./ErrorBox.css";
import {VscError} from "@react-icons/all-files/vsc/VscError";

export default function ErrorBox({children}) {

    return <div className="ErrorBox">
        <div>
            <VscError size={25}/>
        </div>
        <pre className="ErrorDetails">
            {children}
        </pre>
    </div>

}
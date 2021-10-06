import { ReactComponent as Logo } from "../../svg/cloud-error.svg"
import "./NoDataError.css"
import React from "react";

export default function NoDataError({msg}) {
    return <div className="NoDataError">
        <Logo style={{width: 120}}/>
        {msg}
    </div>

}
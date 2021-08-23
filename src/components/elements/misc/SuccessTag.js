import React from "react";
import "./SuccessTag.css";

import {BsCheckCircle} from "@react-icons/all-files/bs/BsCheckCircle";

export default function SuccessTag({label}) {
    return <div className="SuccessTag">
        <BsCheckCircle size={15} style={{marginRight: 5}}/>
        {label}
    </div>
}